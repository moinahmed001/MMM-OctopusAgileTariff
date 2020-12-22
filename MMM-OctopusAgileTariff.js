/* Magic Mirror
 * Module: MMM-OctopusAgileTariff
 *
 * By Moin Ahmed
 *
 */
Module.register("MMM-OctopusAgileTariff", {

    // Module config defaults.
    defaults: {
        useHeader: true, // false if you don't want a header
        header: "Octopus Agile Prices", // Any text you want
        maxWidth: "250px",
        animationSpeed: 3000, // fade in and out speed
        initialLoadDelay: 4250,
        updateInterval: 30 * 60 * 1000,
    },

    getStyles: function() {
        return ["MMM-OctopusAgileTariff.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

        // Set locale.
        this.url = "http://moinahmed.ddns.net:5000/api/octopus/agile/tariff";
        this.OctopusAgileTariff = [];
        this.scheduleUpdate();       // <-- When the module updates (see below)
    },

    getDom: function() {

		// creating the wrapper
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

		// The loading sequence
        if (!this.loaded) {
            wrapper.innerHTML = "Octopus prices appearing ..!";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

		// creating the header
        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }

        var shape = document.createElement("div");
        shape.classList.add("xsmall", "bright", "shape", "left-text");
        shape.innerHTML = "Time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Price";
        wrapper.appendChild(shape);

        var Keys = Object.keys(this.OctopusAgileTariff);
        for (i=0; i<Keys.length; i++){
            if (this.OctopusAgileTariff[i].time != undefined && this.OctopusAgileTariff[i].value_inc_vat != undefined){
                var tariff = document.createElement("div");
                if (this.OctopusAgileTariff[i].value_inc_vat < 8){
                    tariff.classList.add("success", "xsmall", "left-text");
                } else if (this.OctopusAgileTariff[i].value_inc_vat > 7 && this.OctopusAgileTariff[i].value_inc_vat < 11){
                    tariff.classList.add("bright", "xsmall", "left-text");
                } else if (this.OctopusAgileTariff[i].value_inc_vat > 10 && this.OctopusAgileTariff[i].value_inc_vat < 16){
                    tariff.classList.add("warning", "xsmall", "left-text");
                } else{
                    tariff.classList.add("danger", "xsmall", "left-text");
                }
                tariff.innerHTML = this.OctopusAgileTariff[i].time + " &nbsp;&nbsp;&nbsp; " + this.OctopusAgileTariff[i].value_inc_vat;
                wrapper.appendChild(tariff);
            } else {
                console.log(">>>>>> ERROR: index " + i);
            }
        }

        return wrapper;

    }, // <-- closes the getDom function from above

	// this processes your data
    processOctopusAgileTariff: function(data) {
        this.OctopusAgileTariff = data;
       // console.log(this.OctopusAgileTariff); // uncomment to see if you're getting data (in dev console)
        this.loaded = true;
    },


// this tells module when to update
    scheduleUpdate: function() {
        setInterval(() => {
            this.getOctopusAgileTariff();
        }, this.config.updateInterval);
        this.getOctopusAgileTariff(this.config.initialLoadDelay);
        var self = this;
    },


	// this asks node_helper for data
    getOctopusAgileTariff: function() {
        this.sendSocketNotification('GET_OctopusAgileTariff', this.url);
    },


	// this gets data from node_helper
    socketNotificationReceived: function(notification, payload) {
        if (notification === "OctopusAgileTariff_RESULT") {
            this.processOctopusAgileTariff(payload);
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
