'use strict';

function getCountedItems(tags) {
    return tags.reduce((allItems, currentIem) => {
        if (currentIem.match("-")) {
            const [key, count] = currentIem.split("-");
            allItems[key] ? allItems[key] += parseFloat(count) : allItems[key] = parseFloat(count);
        } else {
            allItems[currentIem] ? allItems[currentIem]++ : allItems[currentIem] = 1;
        }
        return allItems;
    }, {});
}

function printReceipt(tags) {
    const countedItems = getCountedItems(tags);

    let totalPrice = 0;
    let savedPrice = 0;
    const output = Object.keys(countedItems).map(barcode => {
        const boughtIem = loadAllItems().find(item => item.barcode === barcode);
        boughtIem.quantity = countedItems[barcode];
        loadPromotions().forEach(promotion => {
            if (promotion.type === 'BUY_TWO_GET_ONE_FREE') {
                promotion.barcodes.forEach(promotionBarcode => {
                    if (promotionBarcode === boughtIem.barcode && boughtIem.quantity > 2) {
                        boughtIem.computedQuantity = boughtIem.quantity;
                        boughtIem.computedQuantity--;
                    }
                })
            }
        });
        boughtIem.subtotalPrice = (boughtIem.computedQuantity || boughtIem.quantity) * boughtIem.price;
        totalPrice = totalPrice + boughtIem.subtotalPrice;
        savedPrice = savedPrice + (boughtIem.computedQuantity ? (boughtIem.quantity - boughtIem.computedQuantity) * boughtIem.price : 0);
        return boughtIem;
    }).map(item =>
        `名称：${item.name}，数量：${item.quantity}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${item.subtotalPrice.toFixed(2)}(元)`).join('\n');
    console.log(`***<没钱赚商店>收据***
${output}
----------------------
总计：${totalPrice.toFixed(2)}(元)
节省：${savedPrice.toFixed(2)}(元)
**********************`);
}