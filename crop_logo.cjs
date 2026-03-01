const Jimp = require('jimp');

async function processLogo() {
    const image = await Jimp.read('client/public/assets/logo-white.png');
    const w = image.bitmap.width;
    const h = image.bitmap.height;

    // Make background transparent and text pure white
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const c = Jimp.intToRGBA(image.getPixelColor(x, y));
            // Background is roughly R:29 G:49 B:40
            if (c.r < 80 && c.g < 100 && c.b < 90) {
                // Transparent
                image.setPixelColor(Jimp.rgbaToInt(0, 0, 0, 0), x, y);
            } else {
                // Anything bright (like white text) becomes pure white
                image.setPixelColor(Jimp.rgbaToInt(255, 255, 255, c.a), x, y);
            }
        }
    }

    // Find non-transparent bounding box
    let minX = w, maxX = 0, minY = h, maxY = 0;

    const colAlpha = new Array(w).fill(0);
    const rowAlpha = new Array(h).fill(0);

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const c = Jimp.intToRGBA(image.getPixelColor(x, y));
            if (c.a > 0) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
                colAlpha[x]++;
                rowAlpha[y]++;
            }
        }
    }

    console.log(`Bounds: X[${minX}-${maxX}] Y[${minY}-${maxY}]`);

    // Find gaps in Y (Vertical layout: Icon on top, Text below)
    let maxGapY = 0, gapYStart = minY, gapYEnd = minY;
    let currentGapStart = -1;
    for (let y = minY; y <= maxY; y++) {
        if (rowAlpha[y] === 0) {
            if (currentGapStart === -1) currentGapStart = y;
        } else {
            if (currentGapStart !== -1) {
                const gapLen = y - currentGapStart;
                if (gapLen > maxGapY) {
                    maxGapY = gapLen;
                    gapYStart = currentGapStart;
                    gapYEnd = y;
                }
                currentGapStart = -1;
            }
        }
    }

    // Find gaps in X (Horizontal layout: Icon on left, Text right)
    let maxGapX = 0, gapXStart = minX, gapXEnd = minX;
    currentGapStart = -1;
    for (let x = minX; x <= maxX; x++) {
        if (colAlpha[x] === 0) {
            if (currentGapStart === -1) currentGapStart = x;
        } else {
            if (currentGapStart !== -1) {
                const gapLen = x - currentGapStart;
                if (gapLen > maxGapX) {
                    maxGapX = gapLen;
                    gapXStart = currentGapStart;
                    gapXEnd = x;
                }
                currentGapStart = -1;
            }
        }
    }

    console.log(`Max Gap Y: ${maxGapY} (at ${gapYStart}-${gapYEnd})`);
    console.log(`Max Gap X: ${maxGapX} (at ${gapXStart}-${gapXEnd})`);

    let cropX = minX, cropY = minY, cropW = maxX - minX, cropH = maxY - minY;

    // We usually want the larger of the two regions if it's text.
    // Actually, text is usually wider than the icon. So we find the wider part.
    if (maxGapY > maxGapX && maxGapY > 5) {
        // Top / Bottom split
        const topHeight = gapYStart - minY;
        const botHeight = maxY - gapYEnd;
        // Assume text is the wider part? Or assume text is bottom? Let's check widths
        let topMaxX = 0, topMinX = w, botMaxX = 0, botMinX = w;
        for (let y = minY; y < gapYStart; y++) {
            for (let x = minX; x <= maxX; x++) { if (Jimp.intToRGBA(image.getPixelColor(x, y)).a > 0) { if (x > topMaxX) topMaxX = x; if (x < topMinX) topMinX = x; } }
        }
        for (let y = gapYEnd; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) { if (Jimp.intToRGBA(image.getPixelColor(x, y)).a > 0) { if (x > botMaxX) botMaxX = x; if (x < botMinX) botMinX = x; } }
        }
        const topWidth = topMaxX - topMinX;
        const botWidth = botMaxX - botMinX;

        if (botWidth > topWidth) {
            console.log("Splitting Y: Text is on bottom");
            cropY = gapYEnd; cropH = maxY - gapYEnd;
            cropX = botMinX; cropW = botMaxX - botMinX;
        } else {
            console.log("Splitting Y: Text is on top");
            cropY = minY; cropH = topHeight;
            cropX = topMinX; cropW = topWidth;
        }
    } else if (maxGapX > 5) {
        console.log("Horizontal split detected. Text is likely on the right side.");
        cropX = gapXEnd;
        cropW = maxX - gapXEnd;

        // update Y crop
        let newMinY = h, newMaxY = 0;
        for (let y = minY; y <= maxY; y++) {
            for (let x = cropX; x <= cropX + cropW; x++) {
                if (Jimp.intToRGBA(image.getPixelColor(x, y)).a > 0) {
                    if (y < newMinY) newMinY = y;
                    if (y > newMaxY) newMaxY = y;
                }
            }
        }
        cropY = newMinY; cropH = newMaxY - newMinY + 1;
    }

    // Add 10px padding for safety
    cropX = Math.max(0, cropX - 10);
    cropY = Math.max(0, cropY - 10);
    cropW = Math.min(w - cropX, cropW + 20);
    cropH = Math.min(h - cropY, cropH + 20);

    console.log(`Final crop: ${cropX}, ${cropY}, ${cropW}, ${cropH}`);
    image.crop(cropX, cropY, cropW, cropH);

    await image.writeAsync('client/public/assets/lux-box-extracted.png');
    console.log("Successfully wrote lux-box-extracted.png");
}

processLogo();
