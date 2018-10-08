const TLN = {
    eventList: {},
    update_line_numbers: function(ta, el) {
        let lines = ta.value.split("\n").length;
        let child_count = el.children.length;
        let difference = lines - child_count;

        if(difference > 0) {
            let frag = document.createDocumentFragment();
            while(difference > 0) {
                let line_number = document.createElement("span");
                line_number.className = "tln-line";
                frag.appendChild(line_number);
                difference--;
            }
            el.appendChild(frag);
        }
        while(difference < 0) {
            el.removeChild(el.firstChild);
            difference++;
        }
    },
    append_line_numbers: function(id) {
        let ta = document.getElementById(id);
        if(ta == null) {
            return console.warn("[tln.js] Couldn't find textarea of id '"+id+"'");
        }
        if(ta.className.indexOf("tln-active") != -1) {
            return console.warn("[tln.js] textarea of id '"+id+"' is already numbered");
        }
        ta.classList.add("tln-active");
        ta.style = {};

        let el = document.createElement("div");
        ta.parentNode.insertBefore(el, ta);
        el.className = "tln-wrapper";
        TLN.update_line_numbers(ta, el);
        TLN.eventList[id] = [];

        const __change_evts = [
            "propertychange", "input", "keydown", "keyup"
        ];
        const __change_hdlr = function(ta, el) {
            return function(e) {
                if((+ta.scrollLeft==10 && (e.keyCode==37||e.which==37
                    ||e.code=="ArrowLeft"||e.key=="ArrowLeft"))
                || e.keyCode==36||e.which==36||e.code=="Home"||e.key=="Home"
                || e.keyCode==13||e.which==13||e.code=="Enter"||e.key=="Enter"
                || e.code=="NumpadEnter")
                    ta.scrollLeft = 0;
                TLN.update_line_numbers(ta, el);
            }
        }(ta, el);
        for(let i = __change_evts.length - 1; i >= 0; i--) {
            ta.addEventListener(__change_evts[i], __change_hdlr);
            TLN.eventList[id].push({
                evt: __change_evts[i],
                hdlr: __change_hdlr
            });
        }

        const __scroll_evts = [ "change", "mousewheel", "scroll" ];
        const __scroll_hdlr = function(ta, el) {
            return function() {  el.scrollTop = ta.scrollTop;  }
        }(ta, el);
        for(let i = __scroll_evts.length - 1; i >= 0; i--) {
            ta.addEventListener(__scroll_evts[i], __scroll_hdlr);
            TLN.eventList[id].push({
                evt: __scroll_evts[i],
                hdlr: __scroll_hdlr
            });
        }
    },
    remove_line_numbers: function(id) {
        let ta = document.getElementById(id);
        if(ta == null) {
            return console.warn("[tln.js] Couldn't find textarea of id '"+id+"'");
        }
        if(ta.className.indexOf("tln-active") == -1) {
            return console.warn("[tln.js] textarea of id '"+id+"' isn't numbered");
        }
        ta.classList.remove("tln-active");

        ta.previousSibling.remove();

        if(!TLN.eventList[id]) return;
        for(let i = TLN.eventList[id].length - 1; i >= 0; i--) {
            const evt = TLN.eventList[id][i];
            ta.removeEventListener(evt.evt, evt.hdlr);
        }
        delete TLN.eventList[id];
    }
}