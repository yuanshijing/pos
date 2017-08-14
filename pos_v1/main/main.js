'use strict';
const info = require('../test/fixtures.js');
const loadAllItems = info.loadAllItems();
const loadPromotions = info.loadPromotions();

//一：整合条码，统计数量
function calculateCount(tags) {
    let tagList = [];
    tags.map(function (value) {
        if (value.indexOf('-') === -1) {
            if (!tagList[value]) {
                //console.log(tagList[value]);
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

//二：生成新的购物清单
function makeNewlist(detailList) {
    let allItem = loadAllItems();
    for (let term of detailList) {
        for (let item of allItem) {
            if (item.barcode === term) {
                term.item = item;
                term.total = term.count * term.item.price;
                break;
            }
        }
    }
    //console.log(detailList);
    return detailList;
}
makeNewList(calculateCount(tags));

//三：匹配促销商品，增加save属性，更新总计；
let list = makeNewList(calculateCount(tags));
function promotion(list, loadPromotions) {
    for (let i of loadPromotions) {
        if (i[typpe] = 'BUY_TWO_GET_ONE_FREE') {
            let save = list.item.price * Math.floor(list.count / 3);
            list.save = save.toFixed(2);
            let total = list.total - list.save;
            list.total = total.toFixed(2);
        }
    }
    return list;
}

//四：更新数组信息
function listWithDiscount(list) {
    let result = [];
    let Promotions = loadPromotions();
    for(let item of promotion){
        for(let key of list) {
            if(item.barcode.includes(key.item.barcode)){
                result.push(promotion(key.item.type))
            }else{
                result.push(key);
            }
        }
    }
    //console.log(result)
    return result;
}
//建立清单
function buildList(discountGoods){
    let str = `***<没钱赚商店>收据***
    `;
    let sum = 0;
    let save = 0;
    for (let good of dicountGoods){
        if(good.save){
            save += good.save;
        }str += `名称:${good.item.name}，数量：${good.count}${good.item.unit}，单价：${good.item.price}(元)，小计：${good.total}(元)
        `;
        sum += good.total;
    }
    str += `----------------------
    总计：${sum.toFixed(2)}(元)
    节省：${save.toFixed(2)}(元)
    **********************`;
    return str;
}
//打印结果
function printList(input){
    let tagsObjList = calculateCount(input);
    let goodsList = makeNewlist(tagsObjList);
    let addDiscount =promotion(goodsList);
    let newList = listWithDiscount(addDiscount);
    let str = buildList(newList);
}
printReceipt(tags);