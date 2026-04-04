// Select the tooltip element
const tooltip = d3.select("#tooltip");

// Load data from CSV
d3.csv("tracks_light.csv").then(function(data) {
    // Define target artists and their neon colors
    const targetArtists = ["My Chemical Romance", "Blink-182", "Sum 41", "Coldplay"];
    const colorScale = d3.scaleOrdinal()
        .domain(targetArtists)
        .range(["#ff003c", "#00f0ff", "#ccff00", "#b026ff"]);

    // Filter data using regex for flexibility
    const filterRegex = /chemical romance|blink-182|sum 41|coldplay/i;
    let myData = data.filter(track => filterRegex.test(track.artists));

    // Format data types and assign main artist group
    myData.forEach(d => {
        d.valence = +d.valence;
        d.energy = +d.energy;
        d.acousticness = +d.acousticness;
        d.danceability = +d.danceability;
        d.popularity = +d.popularity;
        d.year = +d.year;
        
        const art = d.artists.toLowerCase();
        if (art.includes("chemical romance")) d.mainArtist = "My Chemical Romance";
        else if (art.includes("blink-182")) d.mainArtist = "Blink-182";
        else if (art.includes("sum 41")) d.mainArtist = "Sum 41";
        else if (art.includes("coldplay")) d.mainArtist = "Coldplay";
    });

    // --- ГЕНЕРАЦІЯ ТАБЛИЦІ 
    const random10 = [...myData].sort(() => 0.5 - Math.random()).slice(0, 10);
    const tableColumns = ["name", "mainArtist", "year", "popularity", "valence", "energy", "danceability", "acousticness"];
    // ==========================================
    // --- РАДАРНА ДІАГРАМА (SPIDER CHART) ---
    // ==========================================
    const radarFeatures = ["valence", "energy", "danceability", "acousticness"];
    const radarLabels = ["Настрій", "Енергія", "Танцювальність", "Акустичність"];

    // 1. Рахуємо середні значення для кожного артиста
    const artistAverages = Array.from(d3.group(myData, d => d.mainArtist), ([artist, tracks]) => {
        let avg = { mainArtist: artist };
        radarFeatures.forEach(f => {
            avg[f] = d3.mean(tracks, d => d[f]);
        });
        return avg;
    });

    // 2. Налаштування полотна радара
    const rWidth = 600, rHeight = 450; // Зробили полотно значно ширшим
    const rRadius = Math.min(rWidth, rHeight) / 2 - 80; // Дали більше відступу від країв

    const radarSvg = d3.select("#radar-chart")
        .append("svg")
        .attr("width", rWidth)
        .attr("height", rHeight)
        .append("g")
        .attr("transform", `translate(${rWidth/2}, ${rHeight/2})`);

    // 3. Шкали (радіус та кут)
    const rScaleRadar = d3.scaleLinear().range([0, rRadius]).domain([0, 1]);
    const angleScale = d3.scaleOrdinal()
        .domain(radarFeatures)
        .range([0, Math.PI/2, Math.PI, 3*Math.PI/2]); // 4 точки: верх, право, низ, ліво

    // 4. Малюємо "павутину" (фонові кола)
    const ticks = [0.2, 0.4, 0.6, 0.8, 1];
    radarSvg.selectAll(".grid-circle")
        .data(ticks).enter().append("circle")
        .attr("r", d => rScaleRadar(d))
        .style("fill", "none")
        .style("stroke", "rgba(255,255,255,0.1)")
        .style("stroke-dasharray", "3,3");

    // 5. Малюємо осі та підписи
    radarFeatures.forEach((f, i) => {
        const angle = angleScale(f) - Math.PI/2;
        
        // Лінія осі
        radarSvg.append("line")
            .attr("x1", 0).attr("y1", 0)
            .attr("x2", rScaleRadar(1) * Math.cos(angle))
            .attr("y2", rScaleRadar(1) * Math.sin(angle))
            .style("stroke", "rgba(255,255,255,0.2)")
            .style("stroke-width", "1px");
            
        // Розумне вирівнювання тексту
        let alignText = "middle";
        if (Math.cos(angle) > 0.5) alignText = "start";   // Якщо це права сторона
        else if (Math.cos(angle) < -0.5) alignText = "end"; // Якщо це ліва сторона

        // Текст (Настрій, Енергія тощо)
        radarSvg.append("text")
            .attr("x", (rRadius + 20) * Math.cos(angle))
            .attr("y", (rRadius + 25) * Math.sin(angle))
            .text(radarLabels[i])
            .style("text-anchor", alignText)
            .style("alignment-baseline", "middle")
            .style("fill", "#c5c6c7")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("letter-spacing", "1px");
    });

    // 6. Генератор полігону (самого графіка)
    const radarLine = d3.lineRadial()
        .angle(d => angleScale(d[0]))
        .radius(d => rScaleRadar(d[1]))
        .curve(d3.curveLinearClosed);

    const radarPath = radarSvg.append("path")
        .style("stroke-width", 3)
        .style("opacity", 0.8);

    // 7. Функція оновлення радара
    function updateRadar(artistName) {
        const dataPoint = artistAverages.find(d => d.mainArtist === artistName);
        if(!dataPoint) return;

        const color = colorScale(artistName);
        const polygonData = radarFeatures.map(f => [f, dataPoint[f]]);

        radarPath.datum(polygonData)
            .transition().duration(500) // Плавна анімація (півсекунди)
            .attr("d", radarLine)
            .style("fill", color)
            .style("stroke", color);
    }

    // 8. Запускаємо початковий радар для першого гурту
    updateRadar("My Chemical Romance");

    // 9. Прив'язуємо подію Hover до карток гуртів у HTML
    d3.selectAll(".artist-card").on("mouseover", function() {
        const artistName = d3.select(this).select("h3").text();
        updateRadar(artistName);
    });
    // ==========================================
    // --- КІНЕЦЬ РАДАРНОЇ ДІАГРАМИ ---
    // ==========================================
    // Заповнюємо заголовки
    const thead = d3.select("#table-head");
    tableColumns.forEach(col => {
        thead.append("th").text(col.toUpperCase());
    });

    // Заповнюємо рядки даними
    const tbody = d3.select("#table-body");
    random10.forEach(row => {
        const tr = tbody.append("tr");
        tableColumns.forEach(col => {
            let val = row[col];
            // Округлюємо дробові числа до 3 знаків для краси
            if (typeof val === "number" && !Number.isInteger(val)) {
                val = val.toFixed(3);
            }
            tr.append("td").text(val);
        });
    });

    // Determine dynamic axis domains
    function getDomain(metric) {
        if (metric === "popularity") return [0, 100];
        if (metric === "year") return [d3.min(myData, d => d.year) - 1, d3.max(myData, d => d.year) + 1];
        return [0, 1];
    }

    // Main function to render a scatter plot
    function drawScatter(containerId, xMetric, yMetric, xLabel, yLabel) {
        const container = document.getElementById(containerId);
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 40, right: 140, bottom: 60, left: 60 };

        // Append SVG
        const svg = d3.select("#" + containerId)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // svg neon glow filter
        const defs = svg.append("defs");
        const filter = defs.append("filter").attr("id", "glow-" + containerId);
        filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // scales
        const xScale = d3.scaleLinear().domain(getDomain(xMetric)).range([margin.left, width - margin.right]);
        const yScale = d3.scaleLinear().domain(getDomain(yMetric)).range([height - margin.bottom, margin.top]);
        const rScale = d3.scaleSqrt().domain([0, 100]).range([3, 15]);

        // gridlines
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickSize(-(height - margin.top - margin.bottom)).tickFormat(""));

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale).tickSize(-(width - margin.left - margin.right)).tickFormat(""));

        // axes and labels
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
        
        // Limit ticks for the year axis
        if (xMetric === "year") {
            xAxis.ticks(6);
        }

        const xAxisGroup = svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis)
            .attr("class", "axis");

        // Rotate labels for the year axis
        if (xMetric === "year") {
            xAxisGroup.selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end")
                .attr("dx", "-0.8em")
                .attr("dy", "0.15em");
        }

        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale))
            .attr("class", "axis");

        // Axis Titles
        svg.append("text").attr("x", margin.left + (width - margin.left - margin.right) / 2).attr("y", height - 15).style("fill", "#c5c6c7").style("text-anchor", "middle").style("font-weight", "bold").text(xLabel);
        svg.append("text").attr("transform", "rotate(-90)").attr("x", -(margin.top + (height - margin.top - margin.bottom) / 2)).attr("y", 20).style("fill", "#c5c6c7").style("text-anchor", "middle").style("font-weight", "bold").text(yLabel);

        // DATA POINTS WITH ANIMATION & FOCUS ---
        const circles = svg.selectAll("circle.dot")
            .data(myData)
            .enter()
            .append("circle")
            .attr("class", d => `dot artist-${d.mainArtist.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`)
            .attr("cx", d => xScale(d[xMetric]))
            .attr("cy", d => yScale(d[yMetric]))
            .attr("fill", d => colorScale(d.mainArtist))
            .attr("opacity", 0.8)
            .attr("stroke", "#0b0c10")
            .attr("stroke-width", 1.5)
            .style("filter", `url(#glow-${containerId})`)
            .attr("r", 0) 
            
            // Intro animation: grow radius
            .call(enter => enter.transition()
                .duration(1000)
                .delay((d, i) => i * 2)
                .attr("r", d => rScale(d.popularity))
            )

            // Focus Mode
            .on("mouseover", function(event, d) {
                // Dim all dots
                svg.selectAll("circle.dot").attr("opacity", 0.1);
                
                // Highlight hovered dot
                d3.select(this)
                    .attr("opacity", 1)
                    .attr("stroke", "#ffffff")
                    .attr("stroke-width", 3);
                
                // Show tooltip
                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`
                    <strong style="color:${colorScale(d.mainArtist)}; font-size: 16px;">${d.name}</strong><br/>
                    <span style="color:#aaa">Артист:</span> ${d.mainArtist}<br/>
                    <span style="color:#aaa">Рік:</span> ${d.year}<br/>
                    <span style="color:#aaa">Популярність:</span> ${d.popularity}
                `)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 28) + "px");
            })
            //Reset Focus
            .on("mouseout", function() {
                // Restore opacity, checking legend status
                svg.selectAll("circle.dot")
                    .attr("opacity", function() {
                        const isHidden = d3.select(this).classed("hidden-by-legend");
                        return isHidden ? 0 : 0.8;
                    })
                    .attr("stroke", "#0b0c10")
                    .attr("stroke-width", 1.5);
                
                tooltip.transition().duration(500).style("opacity", 0);
            });

        // interactive legend
        const legend = svg.append("g").attr("transform", `translate(${width - margin.right + 30}, ${margin.top})`);
        
        targetArtists.forEach((artist, i) => {
            const artistClass = `artist-${artist.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
            
            const legendRow = legend.append("g")
                .attr("transform", `translate(0, ${i * 30})`)
                .attr("class", "legend-item")
                // Click to toggle artist visibility
                .on("click", function() {
                    const row = d3.select(this);
                    const isInactive = row.classed("inactive");
                    
                    row.classed("inactive", !isInactive);
                    row.style("opacity", isInactive ? 1 : 0.3);
                    
                    svg.selectAll(`.dot.${artistClass}`)
                        .classed("hidden-by-legend", !isInactive)
                        .transition().duration(300)
                        .attr("r", isInactive ? d => rScale(d.popularity) : 0)
                        .attr("opacity", isInactive ? 0.8 : 0);
                });

            legendRow.append("circle")
                .attr("cx", 0).attr("cy", 0).attr("r", 7)
                .attr("fill", colorScale(artist))
                .style("filter", `url(#glow-${containerId})`);
                
            legendRow.append("text")
                .attr("x", 20).attr("y", 5)
                .style("fill", "#fff")
                .style("font-size", "15px")
                .text(artist);
        });
    }

    // init charts
    drawScatter("chart1", "valence", "energy", "← Сумніші | Настрій | Веселіші →", "Енергійність");
    drawScatter("chart2", "acousticness", "danceability", "← Студійні/Електронні | Акустичність | Живі інструменти →", "Танцювальність");
    drawScatter("chart3", "year", "popularity", "Рік випуску", "Рівень популярності");
});