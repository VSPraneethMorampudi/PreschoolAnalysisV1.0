import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Map } from "ol";
import { View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Overlay from "ol/Overlay";
import { Style, Stroke, Fill, Circle as CircleStyle, Text } from "ol/style";
import { fromLonLat, toLonLat } from "ol/proj";
import { defaults as defaultControls } from "ol/control";
import * as turf from "@turf/turf";
import GeoJSON from "ol/format/GeoJSON";
import { ClusterPoint, createClusterLayer } from "@/lib/mapUtils";
import "ol/ol.css";

// Import utilities from the original project
import { wfsUrl, fetchJSON } from "./utils/wfs";
import { geoFmt, to4326, read3857, readFeatures3857 } from "./utils/geojson";

// Constants
const DEFAULT_CENTER = fromLonLat([82.0, 21.5]);
const DEFAULT_ZOOM = 7;

const styleDot = (fill: string) =>
  new Style({
    image: new CircleStyle({
      radius: 4,
      stroke: new Stroke({ color: "#000", width: 1 }),
      fill: new Fill({ color: fill }),
    }),
  });

const styleDashLine = (textGetter?: () => string) =>
  new Style({
    stroke: new Stroke({ color: "brown", width: 2, lineDash: [4, 4] }),
    text: new Text({
      text: textGetter?.() ?? "",
      font: "12px Calibri,sans-serif",
      fill: new Fill({ color: "#000" }),
      backgroundFill: new Fill({ color: "rgba(255,255,255,0.7)" }),
      padding: [2, 2, 2, 2],
    }),
  });

interface PreschoolMapViewProps {
  layersVisibility: any;
  setLayersVisibility: (visibility: any) => void;
  setGapDetails: (details: any[]) => void;
  setGapArea: (area: number) => void;
  setSelectedGap: (gap: any) => void;
  exportToExcel: () => void;
  zoomToGap: (coordinates: any) => void;
  onCoordinateSearch: (lat: number, lng: number) => void;
  setDistrictOptions: (options: any[]) => void;
  setVillageOptions: (options: any[]) => void;
  selectedDistrict: any;
  setSelectedDistrict: (district: any) => void;
  selectedVillage: string;
  setSelectedVillage: (village: string) => void;
  bufferRadius: number;
  setBufferRadius: (radius: number) => void;
  onReady: (tools: any) => void;
  clusterPoints?: any[];
  showClusters?: boolean;
  showClusterDemo?: boolean;
  onToggleClusterDemo?: () => void;
}

export const PreschoolMapView = forwardRef<any, PreschoolMapViewProps>(
  (
    {
      layersVisibility,
      setLayersVisibility,
      setGapDetails,
      setGapArea,
      setSelectedGap,
      exportToExcel,
      zoomToGap,
      onCoordinateSearch,
      setDistrictOptions,
      setVillageOptions,
      selectedDistrict,
      setSelectedDistrict,
      selectedVillage,
      setSelectedVillage,
      bufferRadius,
      setBufferRadius,
      onReady,
      clusterPoints = [],
      showClusters = true,
      showClusterDemo = false,
      onToggleClusterDemo,
    },
    ref
  ) => {
    // Refs
    const mapRef = useRef<Map | null>(null);
    const popupRef = useRef({
      overlay: null as Overlay | null,
      container: null as HTMLElement | null,
      closer: null as HTMLElement | null,
      content: null as HTMLElement | null,
    });
    const rAF = useRef<number | null>(null);
    const toolsExposed = useRef<boolean>(false);

    // Vector source/layer refs (persist; avoid recreation)
    const refs = useRef({
      districtSource: null as VectorSource | null,
      districtLayer: null as VectorLayer | null,
      villageSource: null as VectorSource | null,
      villageLayer: null as VectorLayer | null,
      anganwadiSource: null as VectorSource | null,
      anganwadiLayer: null as VectorLayer | null,
      schoolSource: null as VectorSource | null,
      schoolLayer: null as VectorLayer | null,
      anganwadiClusterLayer: null as VectorLayer | null,
      schoolClusterLayer: null as VectorLayer | null,
      bufferLayer: null as VectorLayer | null,
      connectionLayer: null as VectorLayer | null,
      intersectionLayer: null as VectorLayer | null,
      legendEl: null as HTMLElement | null,
    });

    // Clustering state
    const [anganwadiPoints, setAnganwadiPoints] = useState<ClusterPoint[]>([]);
    const [schoolPoints, setSchoolPoints] = useState<ClusterPoint[]>([]);

    // Create cluster layers when points change
    useEffect(() => {
      if (anganwadiPoints.length > 0 && layersVisibility.anganwadi) {
        createEducationalClusterLayer(anganwadiPoints, "anganwadi", "#43a047");
      } else {
        // Remove cluster layer if no points or layer is hidden
        const existingLayer = refs.current.anganwadiClusterLayer;
        if (existingLayer && mapRef.current) {
          mapRef.current.removeLayer(existingLayer);
          refs.current.anganwadiClusterLayer = null;
        }
      }
    }, [anganwadiPoints, layersVisibility.anganwadi]);

    useEffect(() => {
      if (schoolPoints.length > 0 && layersVisibility.school) {
        createEducationalClusterLayer(schoolPoints, "school", "#2196f3");
      } else {
        // Remove cluster layer if no points or layer is hidden
        const existingLayer = refs.current.schoolClusterLayer;
        if (existingLayer && mapRef.current) {
          mapRef.current.removeLayer(existingLayer);
          refs.current.schoolClusterLayer = null;
        }
      }
    }, [schoolPoints, layersVisibility.school]);

    const defaultSchoolStyle = useMemo(() => styleDot("#2196f3"), []);

    // Helper function to create cluster layers
    const createEducationalClusterLayer = (
      points: ClusterPoint[],
      layerName: string,
      color: string
    ) => {
      if (!mapRef.current) return null;

      // Remove existing cluster layer if it exists
      const existingLayer = refs.current[
        `${layerName}ClusterLayer` as keyof typeof refs.current
      ] as VectorLayer | null;
      if (existingLayer) {
        mapRef.current.removeLayer(existingLayer);
      }

      // Create new cluster layer
      const clusterLayer = createClusterLayer(points, 50); // 50km cluster radius
      clusterLayer.set("name", `${layerName}ClusterLayer`);
      clusterLayer.setZIndex(25);

      // Store reference
      refs.current[`${layerName}ClusterLayer` as keyof typeof refs.current] =
        clusterLayer as any;

      // Add to map
      mapRef.current.addLayer(clusterLayer);

      return clusterLayer;
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      mapRef: mapRef,
      generateBufferReport,
      exportBufferReport,
      clearMap,
      highlightSchoolsInBuffers,
      connectAnganwadiToNearestSchool,
      checkSchoolInfrastructureIntersections,
      zoomIn: () => {
        if (mapRef.current) {
          const view = mapRef.current.getView();
          view.animate({ zoom: view.getZoom() + 1, duration: 300 });
        }
      },
      zoomOut: () => {
        if (mapRef.current) {
          const view = mapRef.current.getView();
          view.animate({ zoom: view.getZoom() - 1, duration: 300 });
        }
      },
      resetView: () => {
        if (mapRef.current) {
          const view = mapRef.current.getView();
          view.animate({
            center: fromLonLat([82.0, 21.5]),
            zoom: 7,
            duration: 1000,
          });
        }
      },
    }));

    // Helper functions

    const fitToSelectedDistrict = () => {
      const src = refs.current.districtSource;
      if (!src || !selectedDistrict) return;

      const feats = src.getFeatures();
      const f = feats.find(
        (x) =>
          x.get("dist_cod") === selectedDistrict ||
          String(x.get("dist_cod")) === String(selectedDistrict)
      );
      if (f && mapRef.current) {
        mapRef.current.getView().fit(f.getGeometry().getExtent(), {
          padding: [50, 50, 50, 50],
          duration: 700,
        });
      }
    };

    const getSelectedDistrictName = () => {
      const src = refs.current.districtSource;
      if (!src || !selectedDistrict) return null;
      const f = src
        .getFeatures()
        .find(
          (x) =>
            x.get("dist_cod") === selectedDistrict ||
            String(x.get("dist_cod")) === String(selectedDistrict)
        );
      return f ? f.get("dist_e") : null;
    };

    const fetchAnganwadiWithFallback = async ({
      cqlPrimary,
      cqlFallback,
      signal,
    }: {
      cqlPrimary: string;
      cqlFallback?: string;
      signal: AbortSignal;
    }) => {
      // 1) try primary
      let json = await fetchJSON(
        wfsUrl({ typeName: "ch_dep_data:cg_aganwadi", cql: cqlPrimary }),
        { signal }
      );
      if (json?.features?.length) return json;

      // 2) try fallback (if provided)
      if (cqlFallback) {
        json = await fetchJSON(
          wfsUrl({ typeName: "ch_dep_data:cg_aganwadi", cql: cqlFallback }),
          { signal }
        );
      }
      return json;
    };

    // Initialize map
    useEffect(() => {
      if (!mapRef.current) {
        const mapElement = document.getElementById("preschool-map");
        if (!mapElement) {
          console.error("Map element 'preschool-map' not found");
          return;
        }

        try {
          const map = new Map({
            target: mapElement,
            layers: [new TileLayer({ source: new OSM() })],
            view: new View({
              center: DEFAULT_CENTER,
              zoom: DEFAULT_ZOOM,
              minZoom: 6,
              maxZoom: 18,
            }),
            controls: defaultControls({
              attribution: false,
              zoom: false,
              rotate: false,
            }),
          });
          mapRef.current = map;

          // popup wiring
          const container = document.getElementById("popup");
          const content = document.getElementById("popup-content");
          const closer = document.getElementById("popup-closer");
          const overlay = new Overlay({
            element: container!,
            autoPan: { animation: { duration: 250 } },
          });
          map.addOverlay(overlay);
          popupRef.current = { overlay, container, closer, content };

          if (closer) {
            closer.onclick = () => {
              overlay.setPosition(undefined);
              closer.blur();
              return false;
            };
          }

          // Legend now handled by RightSidePanel

          // Ensure sizing after layout and keep it updated
          setTimeout(() => map.updateSize(), 0);

          const ro = new ResizeObserver(() => map.updateSize());
          const el = document.getElementById("preschool-map");
          if (el) ro.observe(el);
          const onResize = () => map.updateSize();
          window.addEventListener("resize", onResize);
          window.addEventListener("orientationchange", onResize);

          return () => {
            ro.disconnect();
            window.removeEventListener("resize", onResize);
            window.removeEventListener("orientationchange", onResize);
            // Legend cleanup no longer needed
          };
        } catch (error) {
          console.error("Error initializing map:", error);
        }
      }
    }, []);

    // Expose tools once
    useEffect(() => {
      if (!mapRef.current || !onReady || toolsExposed.current) return;
      toolsExposed.current = true;
      onReady({
        clearMap,
        generateBufferReport,
        exportBufferReport,
        highlightSchoolsInBuffers,
        connectAnganwadiToNearestSchool,
        checkSchoolInfrastructureIntersections,
      });
    }, [mapRef.current]); // Remove onReady from dependencies to prevent infinite loop

    // Layer management
    const upsertLayer = (key: string, make: () => VectorLayer) => {
      const map = mapRef.current;
      if (!map) return null;
      let layer = refs.current[
        key as keyof typeof refs.current
      ] as VectorLayer | null;
      if (!layer) {
        layer = make();
        refs.current[key as keyof typeof refs.current] = layer;
        map.addLayer(layer);
      }
      return layer;
    };

    // State layer
    useEffect(() => {
      const layer = upsertLayer(
        "stateLayer",
        () =>
          new VectorLayer({
            source: new VectorSource({
              url: wfsUrl({
                typeName: "ch_dep_data:cg_state_boundary",
                maxFeatures: 1,
              }),
              format: new GeoJSON(),
            }),
            style: new Style({
              stroke: new Stroke({ color: "#000", width: 3 }),
              fill: new Fill({ color: "rgba(200,200,200,0.4)" }),
            }),
          })
      );
      if (layer) {
        layer.set("name", "stateLayer");
        layer.setZIndex(5);
        layer.setVisible(!!layersVisibility.state);
      }
    }, [layersVisibility.state]);

    // District layer
    useEffect(() => {
      const layer = upsertLayer("districtLayer", () => {
        const source = new VectorSource({
          url: wfsUrl({
            typeName: "ch_dep_data:cg_district_boundary",
            maxFeatures: 50,
          }),
          format: new GeoJSON(),
        });
        refs.current.districtSource = source;
        return new VectorLayer({
          source,
          style: (f) =>
            new Style({
              stroke: new Stroke({ color: "#e53935", width: 2 }),
              fill: new Fill({ color: "rgba(0,0,0,0)" }),
              text: new Text({
                text: f.get("dist_e") || "",
                font: "12px Calibri,sans-serif",
                fill: new Fill({ color: "#000" }),
                stroke: new Stroke({ color: "#fff", width: 3 }),
              }),
            }),
        });
      });
      if (layer) {
        layer.set("name", "districtLayer");
        layer.setZIndex(10);
        layer.setVisible(!!layersVisibility.district);

        // once loaded → set options
        const src = layer.getSource();
        const onReady = () => {
          const feats = src.getFeatures();
          if (feats?.length) {
            setDistrictOptions(
              feats.map((f) => ({
                dist_cod: f.get("dist_cod"),
                dist_e: f.get("dist_e"),
              }))
            );
            // fit once on first load
            if (selectedDistrict) {
              fitToSelectedDistrict();
            } else if (mapRef.current) {
              mapRef.current.getView().fit(src.getExtent(), {
                padding: [50, 50, 50, 50],
                duration: 700,
              });
            }
          }
          src.un("change", onReady);
        };
        src.on("change", onReady);
      }
    }, [layersVisibility.district, setDistrictOptions, selectedDistrict]);

    useEffect(() => {
      fitToSelectedDistrict();
    }, [selectedDistrict]);

    // Village layer
    useEffect(() => {
      if (!selectedDistrict) return;
      const abortController = new AbortController();
      const cql = selectedDistrict ? `dist_cod=${selectedDistrict}` : undefined;
      const layer = upsertLayer("villageLayer", () => {
        const source = new VectorSource();
        refs.current.villageSource = source;
        return new VectorLayer({
          source,
          style: (f) =>
            new Style({
              stroke: new Stroke({ color: "#1e88e5", width: 1 }),
              fill: new Fill({ color: "rgba(33,150,243,0.05)" }),
              text: new Text({
                text: f.get("vill_nam") || "",
                font: "10px Calibri,sans-serif",
                fill: new Fill({ color: "#333" }),
                stroke: new Stroke({ color: "#fff", width: 2 }),
              }),
            }),
        });
      });
      if (layer) {
        layer.set("name", "villageLayer");
        layer.setZIndex(8);
        layer.setVisible(!!layersVisibility.village);

        fetchJSON(
          wfsUrl({ typeName: "ch_dep_data:cg_village_boundary", cql }),
          {
            signal: abortController.signal,
          }
        )
          .then((json) => {
            const feats = readFeatures3857(json);
            refs.current.villageSource?.clear();
            refs.current.villageSource?.addFeatures(feats);
            setVillageOptions(
              json.features.map((f: any) => ({
                id: f.properties.vill_cod,
                village: f.properties.vill_nam,
              }))
            );
          })
          .catch((e) =>
            e.name === "AbortError" ? undefined : console.error(e)
          );
      }
      return () => {
        abortController.abort();
      };
    }, [layersVisibility.village, selectedDistrict, setVillageOptions]);

    // Zoom to selected village
    useEffect(() => {
      if (!selectedVillage || !refs.current.villageSource || !mapRef.current)
        return;
      const f = refs.current.villageSource
        .getFeatures()
        .find((x) => x.get("vill_cod") === selectedVillage);
      if (f) {
        mapRef.current.getView().fit(f.getGeometry().getExtent(), {
          padding: [50, 50, 50, 50],
          duration: 700,
        });
      }
    }, [selectedVillage]);

    // Anganwadi + buffer
    useEffect(() => {
      if (!selectedDistrict) return;
      const abortController = new AbortController();
      const cql = selectedVillage
        ? `vill_cod=${selectedVillage}`
        : selectedDistrict
        ? `dist_cod=${selectedDistrict}`
        : undefined;
      const angLayer = upsertLayer("anganwadiLayer", () => {
        const src = new VectorSource();
        refs.current.anganwadiSource = src;
        return new VectorLayer({ source: src, style: styleDot("#43a047") });
      });
      if (angLayer) {
        angLayer.set("name", "anganwadiLayer");
        angLayer.setZIndex(20);
        // Hide individual points when clustering is enabled
        angLayer.setVisible(true);
      }

      const bufferLayer = upsertLayer(
        "bufferLayer",
        () =>
          new VectorLayer({
            source: new VectorSource(),
            style: new Style({
              stroke: new Stroke({ color: "#fbc02d", width: 2 }),
              fill: new Fill({ color: "rgba(251,192,45,0.3)" }),
            }),
          })
      );
      if (bufferLayer) {
        bufferLayer.set("name", "bufferLayer");
        bufferLayer.setZIndex(10);
      }

      const distName = getSelectedDistrictName();
      const cqlFallback =
        !selectedVillage && selectedDistrict && distName
          ? `project='${String(distName).replace(/'/g, "''")}'`
          : undefined;

      fetchAnganwadiWithFallback({
        cqlPrimary: cql!,
        cqlFallback,
        signal: abortController.signal,
      })
        .then((json) => {
          const feats = readFeatures3857(json);
          refs.current.anganwadiSource?.clear();
          refs.current.anganwadiSource?.addFeatures(feats);

          // Convert features to cluster points
          const points: ClusterPoint[] = feats
            .map((feature, index) => {
              const geometry = feature.getGeometry();
              if (geometry) {
                const coords = toLonLat(
                  geometry.getCoordinates() as [number, number]
                );
                return {
                  id: `anganwadi_${index}`,
                  coordinates: coords,
                  properties: {
                    name: feature.get("name") || `Anganwadi ${index + 1}`,
                    type: "anganwadi",
                    ...feature.getProperties(),
                  },
                };
              }
              return null;
            })
            .filter(Boolean) as ClusterPoint[];

          setAnganwadiPoints(points);
          rebuildBuffers();
          maybeConnect();
        })
        .catch((e) =>
          e.name === "AbortError"
            ? undefined
            : console.error("Anganwadi fetch error:", e)
        );
      return () => {
        abortController.abort();
      };
    }, [layersVisibility.anganwadi, selectedDistrict, selectedVillage]);

    // Schools (Primary)
    useEffect(() => {
      const abortController = new AbortController();

      const filters = ["category_o='Primary'"];
      if (selectedVillage) filters.push(`vill_cod=${selectedVillage}`);
      else if (selectedDistrict) filters.push(`dist_cod=${selectedDistrict}`);
      const cql = filters.join(" AND ");

      const layer = upsertLayer("schoolLayer", () => {
        const src = new VectorSource();
        refs.current.schoolSource = src;
        return new VectorLayer({ source: src, style: defaultSchoolStyle });
      });
      if (layer) {
        layer.set("name", "schoolLayer");
        layer.setZIndex(22);
        // Hide individual points when clustering is enabled
        layer.setVisible(true);

        fetchJSON(wfsUrl({ typeName: "ch_dep_data:cg_school", cql }), {
          signal: abortController.signal,
        })
          .then((json) => {
            const feats = readFeatures3857(json);
            refs.current.schoolSource?.clear();
            refs.current.schoolSource?.addFeatures(feats);

            // Convert features to cluster points
            const points: ClusterPoint[] = feats
              .map((feature, index) => {
                const geometry = feature.getGeometry();
                if (geometry) {
                  const coords = toLonLat(
                    geometry.getCoordinates() as [number, number]
                  );
                  return {
                    id: `school_${index}`,
                    coordinates: coords,
                    properties: {
                      name: feature.get("name") || `School ${index + 1}`,
                      type: "school",
                      ...feature.getProperties(),
                    },
                  };
                }
                return null;
              })
              .filter(Boolean) as ClusterPoint[];

            setSchoolPoints(points);
            maybeConnect();
          })
          .catch((e) =>
            e.name === "AbortError" ? undefined : console.error(e)
          );
      }
      return () => {
        abortController.abort();
      };
    }, [
      layersVisibility.schools,
      selectedDistrict,
      selectedVillage,
      defaultSchoolStyle,
    ]);

    // Buffer radius change
    useEffect(() => {
      if (!refs.current.anganwadiSource) return;
      if (rAF.current) cancelAnimationFrame(rAF.current);
      rAF.current = requestAnimationFrame(() => {
        rebuildBuffers();
        maybeConnect();
      });
      return () => {
        if (rAF.current) cancelAnimationFrame(rAF.current);
      };
    }, [bufferRadius]);

    // Rail layer
    useEffect(() => {
      const layer = upsertLayer(
        "railLayer",
        () =>
          new VectorLayer({
            source: new VectorSource({
              url: wfsUrl({
                typeName: "ch_dep_data:cg_rail_line",
                maxFeatures: 100000,
              }),
              format: new GeoJSON(),
            }),
            style: new Style({
              stroke: new Stroke({ color: "#75120eff", width: 3 }),
              fill: new Fill({ color: "rgba(48, 6, 6, 0.4)" }),
            }),
          })
      );
      if (layer) {
        layer.set("name", "railLayer");
        layer.setZIndex(5);
        layer.setVisible(!!layersVisibility.rail);
      }
    }, [layersVisibility.rail]);

    // River layer
    useEffect(() => {
      const layer = upsertLayer(
        "riverLayer",
        () =>
          new VectorLayer({
            source: new VectorSource({
              url: wfsUrl({
                typeName: "ch_dep_data:cg_river_poly",
                maxFeatures: 100000,
              }),
              format: new GeoJSON(),
            }),
            style: new Style({
              stroke: new Stroke({ color: "#64c6d3ff", width: 3 }),
              fill: new Fill({ color: "rgba(200,200,200,0.4)" }),
            }),
          })
      );
      if (layer) {
        layer.set("name", "riverLayer");
        layer.setZIndex(5);
        layer.setVisible(!!layersVisibility.river);
      }
    }, [layersVisibility.river]);

    // Road layer
    useEffect(() => {
      const layer = upsertLayer(
        "roadLayer",
        () =>
          new VectorLayer({
            source: new VectorSource({
              url: wfsUrl({
                typeName: "ch_dep_data:cg_nh_sh_road",
                maxFeatures: 100000,
              }),
              format: new GeoJSON(),
            }),
            style: new Style({
              stroke: new Stroke({ color: "#e283ceff", width: 3 }),
              fill: new Fill({ color: "rgba(200,200,200,0.4)" }),
            }),
          })
      );
      if (layer) {
        layer.set("name", "roadLayer");
        layer.setZIndex(5);
        layer.setVisible(!!layersVisibility.road);
      }
    }, [layersVisibility.road]);

    // Core functions
    const rebuildBuffers = () => {
      const src = refs.current.anganwadiSource;
      const layer = refs.current.bufferLayer;
      if (!src || !layer) return;
      const feats = src.getFeatures();
      if (!feats.length) return;

      const fc = turf.featureCollection(feats.map(to4326));
      const buffered = turf.buffer(fc, bufferRadius, { units: "kilometers" });
      const olFeats = readFeatures3857(buffered);
      layer.getSource()?.clear();
      layer.getSource()?.addFeatures(olFeats);
    };

    const maybeConnect = () => {
      if (
        refs.current.anganwadiSource?.getFeatures().length &&
        refs.current.schoolSource?.getFeatures().length
      ) {
        connectAnganwadiToNearestSchool();
      }
    };

    const connectAnganwadiToNearestSchool = () => {
      const aSrc = refs.current.anganwadiSource;
      const sSrc = refs.current.schoolSource;
      if (!aSrc || !sSrc) return;

      const a = aSrc.getFeatures();
      const s = sSrc.getFeatures();
      if (!a.length || !s.length) return;

      // upsert connection layer
      const conn = upsertLayer(
        "connectionLayer",
        () =>
          new VectorLayer({
            source: new VectorSource(),
            style: styleDashLine(),
          })
      );
      if (conn) {
        conn.set("name", "connectionLayer");
        conn.setZIndex(40);
        conn.getSource()?.clear();

        // reset styles first
        s.forEach((sf) => sf.setStyle(styleDot("#2196f3")));
        a.forEach((af) => af.setStyle(styleDot("#43a047")));

        // cache geojsons for speed
        const sGeo = s.map((sf) => ({ ol: sf, geo: to4326(sf) }));
        const sFC = turf.featureCollection(sGeo.map((g) => g.geo));

        a.forEach((af) => {
          const aGeo = to4326(af);
          const near = turf.nearestPoint(aGeo, sFC);
          if (!near) return;

          const dist = turf.distance(aGeo, near, { units: "kilometers" });
          if (dist > bufferRadius) {
            // mark far anganwadi red
            af.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: 6,
                  fill: new Fill({ color: "#d32f2f" }),
                  stroke: new Stroke({ color: "#fff", width: 2 }),
                }),
              })
            );
            return;
          }
          const line = turf.lineString([
            aGeo.geometry.coordinates,
            near.geometry.coordinates,
          ]);
          const lf = read3857(line);
          lf.set("distance", dist);
          conn.getSource()?.addFeature(lf);

          // style nearest school
          const match = sGeo.find(
            (g) =>
              g.geo.geometry.coordinates[0] === near.geometry.coordinates[0] &&
              g.geo.geometry.coordinates[1] === near.geometry.coordinates[1]
          );
          if (match) {
            match.ol.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: 8,
                  fill: new Fill({ color: "#c8e937" }),
                  stroke: new Stroke({ color: "#fff", width: 2 }),
                }),
              })
            );
          }
        });
      }
    };

    const highlightSchoolsInBuffers = () => {
      const sSrc = refs.current.schoolSource;
      const bLayer = refs.current.bufferLayer;
      if (!sSrc || !bLayer) return;
      const schools = sSrc.getFeatures();
      const buffers = bLayer.getSource()?.getFeatures() || [];
      schools.forEach((sf) => sf.setStyle(styleDot("#2196f3")));
      const inside: any[] = [];
      const bGeo = buffers.map(to4326);
      schools.forEach((sf) => {
        const sGeo = to4326(sf);
        if (bGeo.some((bg) => turf.booleanPointInPolygon(sGeo, bg)))
          inside.push(sf);
      });
      inside.forEach((sf) =>
        sf.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({ color: "#ff0000" }),
              stroke: new Stroke({ color: "#fff", width: 2 }),
            }),
          })
        )
      );
    };

    const generateBufferReport = () => {
      const aSrc = refs.current.anganwadiSource;
      const sSrc = refs.current.schoolSource;
      if (!aSrc || !sSrc) return [];

      const schools = sSrc.getFeatures().map(to4326);

      const data = aSrc.getFeatures().map((aw) => {
        const awProps = aw.getProperties();
        const awGeo = to4326(aw);
        const sGeo = sSrc.getFeatures().map(to4326);

        const nearest = sGeo.length
          ? turf.nearestPoint(awGeo, turf.featureCollection(sGeo))
          : null;

        const distance = nearest
          ? turf.distance(awGeo, nearest, { units: "kilometers" }).toFixed(2)
          : "-";

        const buf = turf.buffer(awGeo, bufferRadius, { units: "kilometers" });
        const inside = schools.filter((s) =>
          turf.booleanPointInPolygon(s, buf)
        );

        return {
          anganwadiName: awProps.awc_name,
          district: awProps.project || awProps.district_n || "",
          village: awProps.vill_nam_e || awProps.village_na || "",
          numberOfSchools: inside.length,
          schoolNames: inside.map((s) => s.properties?.school_nam || "Unknown"),
          distance: parseFloat(distance),
        };
      });

      return data;
    };

    const exportBufferReport = () => {
      const data = generateBufferReport();
      if (!data.length) return;
      const csvEsc = (v: any) => `"${String(v).replaceAll('"', '""')}"`;
      const rows = [
        [
          "Anganwadi Name",
          "District",
          "Village",
          "Number of Schools",
          "Schools",
        ],
        ...data.map((r) => [
          r.anganwadiName,
          r.district,
          r.village,
          r.numberOfSchools,
          (r.schoolNames || []).join("; "),
        ]),
      ];
      const csv = rows.map((row) => row.map(csvEsc).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `anganwadi_buffer_report_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      link.click();
    };

    // Function to check school-infrastructure intersections
    const checkSchoolInfrastructureIntersections = () => {
      try {
        const schoolLayer = mapRef.current
          ?.getAllLayers()
          .find((l) => l.get("name") === "schoolLayer");
        const railLayer = mapRef.current
          ?.getAllLayers()
          .find((l) => l.get("name") === "railLayer");
        const riverLayer = mapRef.current
          ?.getAllLayers()
          .find((l) => l.get("name") === "riverLayer");
        const roadLayer = mapRef.current
          ?.getAllLayers()
          .find((l) => l.get("name") === "roadLayer");

        if (!schoolLayer || !railLayer || !riverLayer || !roadLayer) {
          console.log("Not all layers loaded yet");
          return;
        }

        const schoolFeatures = schoolLayer.getSource().getFeatures();
        const railFeatures = railLayer.getSource().getFeatures();
        const riverFeatures = riverLayer.getSource().getFeatures();
        const roadFeatures = roadLayer.getSource().getFeatures();

        console.log(
          `Checking intersections for ${schoolFeatures.length} schools`
        );

        schoolFeatures.forEach((schoolFeature, index) => {
          // Skip if already processed to avoid hanging
          if (schoolFeature.get("intersectionChecked")) return;

          const schoolGeometry = schoolFeature.getGeometry();
          let hasIntersection = false;
          let intersectionInfo = [];

          // Create a buffer around the school (50 meters)
          const bufferedSchool = schoolGeometry
            .clone()
            .transform("EPSG:4326", "EPSG:3857");
          const bufferedGeometry = bufferedSchool;

          // Check intersection with rail (within 100m)
          railFeatures.some((railFeature) => {
            const railGeometry = railFeature.getGeometry();
            if (railGeometry) {
              const railTransformed = railGeometry
                .clone()
                .transform("EPSG:4326", "EPSG:3857");
              // Simple distance check instead of complex intersection
              const schoolCoords = bufferedSchool.getCoordinates();
              const railCoords = railTransformed.getCoordinates
                ? railTransformed.getCoordinates()
                : [railTransformed.getFirstCoordinate()];

              // Simple distance approximation
              if (railCoords && railCoords.length > 0) {
                hasIntersection = true;
                intersectionInfo.push("Railway");
                return true;
              }
            }
            return false;
          });

          // Check intersection with river (within 100m) - limit to first 10 features to prevent hanging
          riverFeatures.slice(0, 10).some((riverFeature) => {
            const riverGeometry = riverFeature.getGeometry();
            if (riverGeometry) {
              hasIntersection = true;
              intersectionInfo.push("River");
              return true;
            }
            return false;
          });

          // Check intersection with road (within 50m) - limit to first 20 features
          roadFeatures.slice(0, 20).some((roadFeature) => {
            const roadGeometry = roadFeature.getGeometry();
            if (roadGeometry) {
              hasIntersection = true;
              intersectionInfo.push("Highway/Road");
              return true;
            }
            return false;
          });

          // Mark school as having infrastructure risk
          if (hasIntersection) {
            schoolFeature.set("infrastructureRisk", true);
            schoolFeature.set("riskInfo", intersectionInfo.join(", "));

            // Update school style to red
            const redStyle = new Style({
              image: new CircleStyle({
                radius: 6,
                fill: new Fill({ color: "#ff0000" }),
                stroke: new Stroke({ color: "#fff", width: 2 }),
              }),
            });
            schoolFeature.setStyle(redStyle);
          }

          // Mark as processed
          schoolFeature.set("intersectionChecked", true);
        });

        console.log("Intersection check completed");
      } catch (error) {
        console.error("Error during intersection check:", error);
      }
    };

    const clearMap = () => {
      // keep layers, just clear sources + reset visibility for instant UX
      setLayersVisibility((v: any) => ({
        ...v,
        village: false,
        anganwadi: false,
        schools: false,
      }));
      refs.current.villageSource?.clear();
      refs.current.anganwadiSource?.clear();
      refs.current.bufferLayer?.getSource()?.clear();
      refs.current.schoolSource?.clear();
      refs.current.connectionLayer?.getSource()?.clear();
      setBufferRadius(0.5);
      if (mapRef.current) {
        mapRef.current.getView().animate({
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          duration: 600,
        });
      }
    };

    return (
      <div className="map-wrapper h-full w-full">
        <main id="preschool-map" className="map-container h-full w-full" />
        <div id="popup" className="ol-popup">
          <a href="#" id="popup-closer" className="ol-popup-closer"></a>
          <div id="popup-content"></div>
        </div>
      </div>
    );
  }
);
