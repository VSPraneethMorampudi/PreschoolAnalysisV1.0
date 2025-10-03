export interface LayerTreeNode {
  id: string;
  title: string;
  titleHindi: string;
  type: 'group' | 'layer';
  children?: LayerTreeNode[];
  layerConfig?: LayerConfig;
  icon?: string;
  description?: string;
  metadata?: LayerMetadata;
  count?: number;
}

export interface LayerConfig {
  id: string;
  type: 'wms' | 'wfs' | 'vector' | 'xyz';
  url: string;
  layers?: string;
  typeName?: string;
  maxZoom?: number;
  opacity?: number;
  color?: string;
}

export interface LayerMetadata {
  description: string;
  source: string;
  lastUpdated: string;
  accuracy: string;
  scale: string;
}

export const chhattisgarhLayerHierarchy: LayerTreeNode = {
  id: 'root',
  title: 'Chhattisgarh GIS Layers',
  titleHindi: 'छत्तीसगढ़ जीआईएस परतें',
  type: 'group',
  children: [
    {
      id: 'boundaries',
      title: 'Boundaries',
      titleHindi: 'सीमाएं',
      type: 'group',
      icon: 'square',
      count: 3,
      children: [
        {
          id: 'state_boundary',
          title: 'State Boundary',
          titleHindi: 'राज्य सीमा',
          type: 'layer',
          layerConfig: {
            id: 'cg_state_boundary',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_state_boundary&maxFeatures=1&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_state_boundary',
            opacity: 0.8,
            color: '#000000'
          }
        },
        {
          id: 'district_boundary',
          title: 'District Boundary',
          titleHindi: 'जिला सीमा',
          type: 'layer',
          layerConfig: {
            id: 'cg_district_boundary',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_district_boundary&maxFeatures=50&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_district_boundary',
            opacity: 0.7,
            color: '#e53935'
          }
        },
        {
          id: 'village_boundary',
          title: 'Village Boundary',
          titleHindi: 'गांव सीमा',
          type: 'layer',
          layerConfig: {
            id: 'cg_village_boundary',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_village_boundary&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_village_boundary',
            opacity: 0.6,
            color: '#1e88e5'
          }
        }
      ]
    },
    {
      id: 'forest_environment',
      title: 'Forest & Environment',
      titleHindi: 'वन और पर्यावरण',
      type: 'group',
      icon: 'triangle',
      count: 6,
      children: [
        {
          id: 'forest_circle',
          title: 'Forest Circle',
          titleHindi: 'वन मंडल',
          type: 'layer',
          layerConfig: {
            id: 'cg_forest_circle',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_forest_circle&maxFeatures=10&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_forest_circle',
            opacity: 0.7,
            color: '#166534'
          }
        },
        {
          id: 'forest_division',
          title: 'Forest Division',
          titleHindi: 'वन प्रभाग',
          type: 'layer',
          layerConfig: {
            id: 'cg_forest_division',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_forest_division&maxFeatures=10&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_forest_division',
            opacity: 0.6,
            color: '#15803d'
          }
        },
        {
          id: 'forest_range',
          title: 'Forest Range',
          titleHindi: 'वन रेंज',
          type: 'layer',
          layerConfig: {
            id: 'cg_forest_range',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_forest_range&maxFeatures=10&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_forest_range',
            opacity: 0.6,
            color: '#16a34a'
          }
        },
        {
          id: 'forest_beat',
          title: 'Forest Beat',
          titleHindi: 'वन बीट',
          type: 'layer',
          layerConfig: {
            id: 'cg_forest_beat',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_forest_beat&maxFeatures=10&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_forest_beat',
            opacity: 0.5,
            color: '#22c55e'
          }
        },
        {
          id: 'forest_compartment',
          title: 'Forest Compartment',
          titleHindi: 'वन कम्पार्टमेंट',
          type: 'layer',
          layerConfig: {
            id: 'cg_forest_compartment',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_forest_compartment&maxFeatures=10&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_forest_compartment',
            opacity: 0.5,
            color: '#4ade80'
          }
        },
        {
          id: 'forest_checkpost',
          title: 'Forest Checkpost',
          titleHindi: 'वन चेकपोस्ट',
          type: 'layer',
          layerConfig: {
            id: 'cg_forest_checkpost',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_forest_checkpost&maxFeatures=10&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_forest_checkpost',
            opacity: 0.8,
            color: '#059669'
          }
        }
      ]
    },
    {
      id: 'mining_geology',
      title: 'Mining & Geology',
      titleHindi: 'खनन और भूविज्ञान',
      type: 'group',
      icon: 'diamond',
      count: 2,
      children: [
        {
          id: 'mineral',
          title: 'Mineral',
          titleHindi: 'खनिज',
          type: 'layer',
          layerConfig: {
            id: 'cg_mineral',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_mineral&maxFeatures=10&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_mineral',
            opacity: 0.7,
            color: '#a16207'
          }
        },
        {
          id: 'auctioned_block',
          title: 'Auctioned Block',
          titleHindi: 'नीलामी ब्लॉक',
          type: 'layer',
          layerConfig: {
            id: 'cg_auctioned_block',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_auctioned_block&maxFeatures=10&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_auctioned_block',
            opacity: 0.6,
            color: '#ea580c'
          }
        }
      ]
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure',
      titleHindi: 'अवसंरचना',
      type: 'group',
      icon: 'road',
      count: 4,
      children: [
        {
          id: 'mdr_roads',
          title: 'MDR Roads',
          titleHindi: 'मुख्य जिला सड़कें',
          type: 'layer',
          layerConfig: {
            id: 'cg_mdr_roads',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_mdr_roads_17_06_25&maxFeatures=10&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_mdr_roads_17_06_25',
            opacity: 0.8,
            color: '#dc2626'
          }
        },
        {
          id: 'nh_sh_roads',
          title: 'NH/SH Roads',
          titleHindi: 'राष्ट्रीय/राज्य राजमार्ग',
          type: 'layer',
          layerConfig: {
            id: 'cg_nh_sh_road',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_nh_sh_road&maxFeatures=100000&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_nh_sh_road',
            opacity: 0.9,
            color: '#e283ceff'
          }
        },
        {
          id: 'state_highway',
          title: 'State Highway',
          titleHindi: 'राज्य राजमार्ग',
          type: 'layer',
          layerConfig: {
            id: 'state_highway',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Astate_highway&maxFeatures=10&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:state_highway',
            opacity: 0.8,
            color: '#d97706'
          }
        },
        {
          id: 'rail_line',
          title: 'Railway Lines',
          titleHindi: 'रेलवे लाइन',
          type: 'layer',
          layerConfig: {
            id: 'cg_rail_line',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_rail_line&maxFeatures=100000&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_rail_line',
            opacity: 0.7,
            color: '#75120eff'
          }
        }
      ]
    },
    {
      id: 'social_infrastructure',
      title: 'Social Infrastructure',
      titleHindi: 'सामाजिक अवसंरचना',
      type: 'group',
      icon: 'school',
      count: 3,
      children: [
        {
          id: 'schools',
          title: 'Schools',
          titleHindi: 'स्कूल',
          type: 'layer',
          layerConfig: {
            id: 'cg_school',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_school&cql_filter=category_o%3D%27Primary%27&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_school',
            opacity: 0.8,
            color: '#2196f3'
          }
        },
        {
          id: 'anganwadi',
          title: 'Anganwadi',
          titleHindi: 'आंगनवाड़ी',
          type: 'layer',
          layerConfig: {
            id: 'cg_anganwadi',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_aganwadi&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_aganwadi',
            opacity: 0.8,
            color: '#43a047'
          }
        },
        {
          id: 'habitation',
          title: 'Habitation',
          titleHindi: 'बस्ती',
          type: 'layer',
          layerConfig: {
            id: 'cg_habitation',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_habitation&maxFeatures=10&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_habitation',
            opacity: 0.7,
            color: '#16a34a'
          }
        }
      ]
    },
    {
      id: 'water_resources',
      title: 'Water Resources',
      titleHindi: 'जल संसाधन',
      type: 'group',
      icon: 'hexagon',
      count: 1,
      children: [
        {
          id: 'river_polygon',
          title: 'River Polygon',
          titleHindi: 'नदी बहुभुज',
          type: 'layer',
          layerConfig: {
            id: 'cg_river_poly',
            type: 'wfs',
            url: 'http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data%3Acg_river_poly&maxFeatures=100000&outputFormat=application%2Fjson',
            typeName: 'ch_dep_data:cg_river_poly',
            opacity: 0.8,
            color: '#64c6d3ff'
          }
        }
      ]
    }
  ]
};