import mitt, { Handler } from 'mitt'

const tabMitt = mitt()

// const newTab = (tab:any) =>{
//     tabMitt.emit('newTab',tab)
// }

let tabNew = {}
let tabSet = {}

export function newTab(tab: any) {
    tabMitt.emit('newTab', tab);
    tabNew = tab;
}

export function setTab(tab: any) {
    tabMitt.emit('setTab', tab);
    tabSet = tab;
}

export function newTabTake(
    handler: (tab: any) => void,
    immediate = true
) {
    tabMitt.on('newTab', handler as Handler);
    console.log("newTab",tabNew)
    if (immediate) {
        handler(tabNew);
    }
}

export function setTabTake(
    handler: (tab: any) => void,
    immediate = true
) {
    tabMitt.on('setTab', handler as Handler);
    console.log("setTab",tabNew)
    if (immediate) {
        handler(tabNew);
    }
}