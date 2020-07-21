import axios from "axios"
let asset_root, icon_root, removable_skill_map, live_map;
if (window.location.protocol === 'https:') {
    asset_root = "//sif-jp-raw.oss-cn-shanghai.aliyuncs.com/";
    icon_root = "//sif-jp-raw.oss-cn-shanghai.aliyuncs.com/png/icon_from_unit_id/";
    removable_skill_map = "//sif-jp-raw.oss-cn-shanghai.aliyuncs.com/dist/removable_skill.min.json";
    live_map = "//sif-jp-raw.oss-cn-shanghai.aliyuncs.com/dist/maps_dict.min.json";

} else {
    asset_root = "http://r.llsif.win/";
    icon_root = "http://114.55.102.93:8080/png/icon_from_unit_id/";
    removable_skill_map = "http://114.55.102.93:8080/dist/removable_skill.min.json";
    live_map = "http://114.55.102.93:8080/dist/maps_dict.min.json";
}
const debug = false;
const api_server = debug?"http://localhost:8090/api/":"http://116.62.149.31/api/";


function getkey(key) {
    return localStorage.getItem(key) || null
}
function setkey(key, value) {
    return localStorage.setItem(key, value)
}
function eventlistPromise(type) {
    return new Promise(function (resolve, reject) {
        axios.get(api_server + "llproxy/eventList/", type ? {
            params: {
                type: type
            }
        } : {}).then(function (resp) {
            if (resp.data.result) resolve(resp.data.result);
            else reject(resp)
        }).catch(function (e) {
            reject(e)
        })
    })
}
function selectevent(eventlist) {
    let sltevent
    for (var x in teventlist) {
        sltevent = eventlist[x].event_id;
        if (Date.now() / 1000 >= (eventlist[x].end.timestamp )) {
            continue
        }
        if (Date.now() / 1000 >= (eventlist[x].begin.timestamp )) {
            break
        }

    }
    return sltevent
}

export default{
    asset_root,
    icon_root,
    api_server,
    removable_skill_map,
    live_map,
    eventlistPromise,
    selectevent,
    getkey,
    setkey
}
