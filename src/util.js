let asset_root;
let asset_root2;
asset_root = "http://r.llsif.win/";
asset_root2 = "https://card.niconi.co.ni/asset/";
const debug = true;
const api_server = debug?"http://localhost:8090/api/":"http://kotoumi.top/api/";


function getkey(key) {
    return localStorage.getItem(key) || null
}
function setkey(key, value) {
    return localStorage.setItem(key, value)
}
function selectevent(eventlist) {
    let sltevent;
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
    asset_root2,
    api_server,
    selectevent,
    getkey,
    setkey
}
