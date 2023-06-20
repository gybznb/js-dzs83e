import './style.css';
import {Map,TileLayer,LayerGroup,Icon,Marker,GeoJSON} from 'leaflet';
import config from './DATA/config.json';
import mian from'./DATA/mian.json';
import region from'./DATA/region.json';
import road from'./DATA/road.json';
import park10 from'./DATA/park.json';
import hosptial10 from'./DATA/hosptial.json';
import shang10 from'./DATA/shang.json';
import pai10 from'./DATA/pai.json';


const map =new Map('map');
map.setView([23.04024483,114.41355217],16);
//天地图矢量地图
const tdtVectorLayer = new TileLayer(config.default.layer.tdtVectorLayer,{});
//天地图矢量注记
const tdtLabelLayer = new TileLayer(config.default.layer.tdtLabelLayer,{});
//天地图矢量图层组
const tdtLayer=new LayerGroup([tdtVectorLayer,tdtLabelLayer]).addTo(map);

//天地图影像地图
const tdtImageVectorLayer = new TileLayer(config.default.layer.tdtImageVectorLayer,{
  subdomains: [0, 1, 2, 3, 4, 5, 6, 7]
});
//天地图影像注记
const tdtImageLabelLayer = new TileLayer(config.default.layer.tdtImageLabelLayer,{
  subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
	transparent: true,
	zIndex: 3
});
//天地图影像图层组
const tdtImageLayer=new LayerGroup([tdtImageVectorLayer,tdtImageLabelLayer]);

//矢量与影像联动
const items=document.getElementsByName('ditu');
items.forEach(item=>{
   item.onclick=evt=>{
     switch(evt.target.value){
       case 'Vector':
       tdtImageLayer.removeFrom(map);
       tdtLayer.addTo(map);
       break
       case 'Image':
       tdtLayer.removeFrom(map);
       tdtImageLayer.addTo(map);
       break
     }
   }
 });

 //学校范围
var RegionStyle={
   color:"#FF4500",
   weight:2,
   opacity:0.7,
   fillColor:"#BBFFFF",
   dashArray:"",
   fillOpacity:0.3,
 };
const linelayer=new GeoJSON(region,{
   style:RegionStyle,
}).addTo(map);


//学校面
const miandata = new GeoJSON(mian,{
  style: function(geoJsonFeature){
    if(geoJsonFeature.properties['类型'] == '草地'){
      return{
        color:"#008B45",
        weight:0,
        opacity:0.7,
        fillColor:"#00CD00",
        fillOpacity:0.7,
      };
    }
    else if(geoJsonFeature.properties['类型'] == '绿化'){
      return{
        color:"#008B45",
        weight:0,
        opacity:0.7,
        fillColor:"#008B45",
        fillOpacity:0.7,
      };
    }
    else if(geoJsonFeature.properties['类型'] == '水域'){
      return{
        weight:0,
        fillColor:"#00BFFF",
        fillOpacity:0.7,
      };
    }
    else if(geoJsonFeature.properties['类型'] == '广场'){
      return{
        weight:0,
        fillColor:"#CFCFCF",
        fillOpacity:0.7,
      };
    }
    else if(geoJsonFeature.properties['类型'] == '跑道'){
      return{
        weight:0,
        fillColor:"#FF6347",
        fillOpacity:0.7,
      };
    }
    else if(geoJsonFeature.properties['类型'] == '停车场'){
      return{
        weight:0,
        fillColor:"＃800080",
        fillOpacity:0.7,
      };
    }
    else if(geoJsonFeature.properties['类型'] == '球场'){
      return{
        weight:0,
        fillColor:"	#191970",
        fillOpacity:0.7,
      };
    }
    else {
      return{
        color:"#363636",
        weight:2,
        opacity:0.7,
        fillColor:"#00688B",
        fillOpacity:0.7,
      };
    }
  },
  onEachFeature: onEachFeature
}).addTo(map);

//面联动
const checkmian = document.getElementById('mian');
checkmian.onchange=evt=>{
  if(evt.target.checked){
    miandata.addTo(map);
  }
  else{
    miandata.removeFrom(map);
  }
};

//道路
const roadData =  new GeoJSON(road,{
  style: function(geoJsonFeature){
    if(geoJsonFeature.properties['类别'] == '行人道路'){
      return{
        color:"#696969",
        weight:2,
        opacity:0.7,
      };
    }
    else if(geoJsonFeature.properties['类别'] == '校内道路'){
      return{
        color:"#696969",
        weight:4,
        opacity:0.7,
      };
    }
    else if(geoJsonFeature.properties['类别'] == '河道'){
      return{
        color:"	#6495ED",
        weight:6,
        opacity:0.7,
      };
    }
    else if(geoJsonFeature.properties['类别'] == '四车道'){
      return{
        color:"#696969",
        weight:8,
        opacity:0.7,
      };
    }
    else if(geoJsonFeature.properties['类别'] == '县道'){
      return{
        color:"#696969",
        weight:6,
        opacity:0.7,
      };
    }
  }
}).addTo(map);

//道路联动
const checkRoad = document.getElementById('road');
checkRoad.onchange=evt=>{
  if(evt.target.checked){
    roadData.addTo(map);
  }
  else{
    roadData.removeFrom(map);
  }
};

//矢量面交互函数
function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
  });
  layer.bringToFront();
  info.update(layer.feature.properties);
}
function resetHighlight(e) {
  miandata.resetStyle(e.target);
  info.update();
}
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
}

//显示控件
 var info = L.control();
 info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); 
    this.update();
    return this._div;
 };
 info.update = function (miandata) {
    this._div.innerHTML = '<h4>学&nbsp;校&nbsp;属&nbsp;性&nbsp;</h4>' +  (miandata ?
        '<b>' + miandata.name + '</b><br />' 
        : '请选择目标');
 };
info.addTo(map);


//位置定位
 var position = [];
 function onLocationFound(e) {
  L.marker(e.latlng, {
          //draggable: true,
          icon:new Icon({
            iconUrl:'data:image/svg+xml,'+encodeURIComponent(config.default.svg.locatesvg),
            iconSize:[32,32],
            iconAnchor:[16,16],
          }),
      })
      .addTo(map)
      .bindPopup("您在这里!").openPopup()
      .on('dragend', function (event) {
          var marker = event.target;
          var latlng = marker.getLatLng();
          position.push(latlng);
      });

  var radius = e.accuracy / 2;
  L.circle(e.latlng, radius).addTo(map);
}

//定位按钮
const checkbn = document.getElementById('dingweibt');
checkbn.onclick=evt=>{ 
  map.locate({
  setView: true,
  maxZoom: 18
  });
  map.on('locationfound', onLocationFound);
};

//公园点
const parklayer = new GeoJSON(park10,{
  pointToLayer:(geojsonPoint,latlng)=>{
    return new Marker(latlng,{
      icon:new Icon({
        iconUrl:'data:image/svg+xml,'+encodeURIComponent(config.default.svg.park),
        iconSize:[32,32],
        iconAnchor:[16,16],
      }),
    }).bindTooltip("名称："+geojsonPoint.properties['名字']+"<br>地址："+geojsonPoint.properties['地址']+"<br>电话："+geojsonPoint.properties['电话'],{permanent:false})
  }});


//派出所点
const pailayer = new GeoJSON(pai10,{
  pointToLayer:(geojsonPoint,latlng)=>{
    return new Marker(latlng,{
      icon:new Icon({
        iconUrl:'data:image/svg+xml,'+encodeURIComponent(config.default.svg.pai),
        iconSize:[32,32],
        iconAnchor:[16,16],
      }),
    }).bindTooltip("名称："+geojsonPoint.properties['名字']+"<br>地址："+geojsonPoint.properties['地址']+"<br>电话："+geojsonPoint.properties['电话'],{permanent:false})
  }});


//医院点
const hosptiallayer = new GeoJSON(hosptial10,{
  pointToLayer:(geojsonPoint,latlng)=>{
    return new Marker(latlng,{
      icon:new Icon({
        iconUrl:'data:image/svg+xml,'+encodeURIComponent(config.default.svg.hosptial),
        iconSize:[32,32],
        iconAnchor:[16,16],
      }),
    }).bindTooltip("名称："+geojsonPoint.properties['名字']+"<br>地址："+geojsonPoint.properties['地址']+"<br>电话："+geojsonPoint.properties['电话'],{permanent:false})
  }});

  
  //商场点
const shanglayer = new GeoJSON(shang10,{
  pointToLayer:(geojsonPoint,latlng)=>{
    return new Marker(latlng,{
      icon:new Icon({
        iconUrl:'data:image/svg+xml,'+encodeURIComponent(config.default.svg.shang),
        iconSize:[32,32],
        iconAnchor:[16,16],
      }),
    }).bindTooltip("名称："+geojsonPoint.properties['名字']+"<br>地址："+geojsonPoint.properties['地址']+"<br>电话："+geojsonPoint.properties['电话'],{permanent:false})
  }});


//设施按钮
//回到学校
const checkhui = document.getElementById('hui');
checkhui.onclick=evt=>{
  parklayer.remove(map);
  pailayer.remove(map);
  hosptiallayer.remove(map);
  shanglayer.remove(map);
  map.flyTo([23.04024483,114.41355217],16);
};



//复选框赋值
var lei='park';
const xuan=document.getElementsByName('skills');
xuan.forEach(item=>{
  item.onclick=evt=>{
    lei=evt.target.value
  }});

//确定按钮，根据复选框的值展示
const checkshi = document.getElementById('queding');
  checkshi.onclick=evt=>{
    switch(lei){
        case 'park':
        map.flyTo([23.04024483,114.41355217],13);
        pailayer.remove(map);
        hosptiallayer.remove(map);
        shanglayer.remove(map);
        parklayer.addTo(map);
        break
        case 'pai':
        map.flyTo([23.04024483,114.41355217],13);
        parklayer.remove(map);
        hosptiallayer.remove(map);
        shanglayer.remove(map);
        pailayer.addTo(map);
        break
        case 'hosptial':
        map.flyTo([23.04024483,114.41355217],13);
        parklayer.remove(map);
        pailayer.remove(map);
        shanglayer.remove(map);
        hosptiallayer.addTo(map);
        break
        case 'shang':
        map.flyTo([23.04024483,114.41355217],13);
        parklayer.remove(map);
        pailayer.remove(map);
        hosptiallayer.remove(map);
        shanglayer.addTo(map);
        break
    }
  };