'use strict';
const info = require('../test/fixtures.js');
const loadAllItems = info.loadAllItems();
const loadPromotions = info.loadPromotions();

//一：整合条码，统计数量
function calculateCount(tags) {
    let tagList = {};
    tags.map(function (value) {
        if (value.indexOf('-') === -1) {
            if (!tagList[value]) {
                tagList[value] = {};
                tagList[value].count = 1;
            } else {
                tagList[value].count++;
            }
        } else {
            let cart = value.split('-');
            //console.log(cart);
            let tag = cart[0];
            let count = parseFloat(cart[1]);
            if (!tagList[tag]) {
                tagList[tag] = {};
                tagList[tag].count = count;
            } else {
                tagList[tag].count += count;
            }
        }
    });
    return tagList;
}
//let T1 = calculateCount(tags)
//console.log(T1);

//二：生成有整合过、有详细信息的清单
function makeNewList(detailList) {
    for (let term in detailList) {
        //console.log(term)
        for (let item of loadAllItems) {
            if (item.barcode === term) {
                detailList[term].item = item;
                detailList[term].total = detailList[term].count * item.price;
                break;
            }
        }
    }
    //console.log(detailList);
    return detailList;
}

//三：匹配促销商品，增加save属性，更新total；
function promotion(list, type) {
    switch(type){
        case 'BUY_TWO_GET_ONE_FREE':
            let save = list.item.price * Math.floor(list.count / 3);
            list.save = save;
            let total = list.total - list.save;
            list.total = total;
    }
    //console.log(list);
    return list;
}

//四：加上促销商品的save、total信息
function listWithDiscount(list) {
    let result = [];
    for(let item of loadPromotions){
        for(let key in list) {
            if(item.barcodes.includes(list[key].item.barcode)){
                result.push(promotion(list[key],item.type))
            }else{
                result.push(list[key]);
            }
        }
    }
    //console.log(result)
    return result;
}
//五、建立清单
function buildList(discountGoods){
    let str = `***<没钱赚商店>收据***
`;
    let sum = 0;
    let save = 0;
    for (let good of discountGoods){
        if(good.save){
            save += good.save;
        }str += `名称：${good.item.name}，数量：${good.count}${good.item.unit}，单价：${good.item.price.toFixed(2)}(元)，小计：${good.total.toFixed(2)}(元)
`;
        sum += good.total;
    }
    str += `----------------------
总计：${sum.toFixed(2)}(元)
节省：${save.toFixed(2)}(元)
**********************`;
    return str;
}

function printReceipt(input){
    let tagList = calculateCount(input);
    let detailList = makeNewList(tagList);
    let newList = listWithDiscount(detailList);
    let str = buildList(newList);
    console.log(str);
}

module.exports = printReceipt;