// --- [ ARCHIEF MET OUDE FUNCTIES ] ---
function setRoleLabelForClassName(className, role, label) {
    "use strict";
    // Stel een ARIA-ROL en ARIA-LABEL in voor een generiek ELEMENT:
    try {
        const elementen = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                // Controleer de lengte van ARGUMENT ROLE:
                if (role.length > 0) {
                    // Bestaat de ROLE al en is deze hetzelfde als wat je gaat
                    // toewijzen? Dan overslaan:
                    if (elementen[i].getAttribute("role") !== role) {
                        elementen[i].setAttribute("role", role);
                    }
                }
                // Controleer de lengte van ARGUMENT LABEL:
                if (label.length > 0) {
                    // Bestaat het LABEL al en is deze hetzelfde als wat je
                    // gaat toewijzen? Dan overslaan:
                    if (elementen[i].getAttribute("aria-label") !== label) {
                        elementen[i].setAttribute("aria-label", label);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setRoleLabelForClassName: " + err.message);
    }
}

function removeRoleFromClassName(className, role) {
    "use strict";
    // Verwijder een ARIA-ROL van een generiek ELEMENT:
    try {
        const elementen = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                // Controleer de lengte van ARGUMENT ROLE:
                if (role.length > 0) {
                    // Bestaat de ROLE en is deze hetzelfde als wat je wenst te
                    // verwijderen? Dan pas verwijderen:
                    if (elementen[i].getAttribute("role") === role) {
                        elementen[i].removeAttribute("role");
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "removeRoleFromClassName: " + err.message);
    }
}

function changeAttrForClassName(className, attr, newValue) {
    "use strict";
    // Verander een ATTRIBUUT van generieke ELEMENTEN:
    try {
        const elementen = document.getElementsByClassName(className);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(elementen)) {
            while (elementen[i]) {
                // Controleer de lengte van beiden ARGUMENTEN:
                if (attr.length > 0 && newValue.length > 0) {
                    // Bestaat het ATTRIBUUT al en is deze hetzelfde als wat je
                    // wenst te verwijderen? Dan pas veranderen:
                    if (elementen[i].getAttribute(attr) !== newValue) {
                        elementen[i].setAttribute(attr, newValue);
                    }
                }
                i += 1;
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "changeAttrForClassName: " + err.message);
    }
}

function changeAttrForId(id, attr, newValue) {
    "use strict";
    // Verander een ATTRIBUUT van generieke ELEMENTEN:
    try {
        const element = document.getElementById(id);
        let i = 0;
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(element)) {
            // Controleer de lengte van beiden ARGUMENTEN:
            if (attr.length > 0 && newValue.length > 0) {
                // Bestaat het ATTRIBUUT al en is deze hetzelfde als wat je
                // wenst te verwijderen? Dan pas veranderen:
                if (element[i].getAttribute(attr) !== newValue) {
                    element[i].setAttribute(attr, newValue);
                }
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "changeAttrForId: " + err.message);
    }
}

function setAccessKeyForId(id, key) {
    "use strict";
    // Stel een ACCESS KEY in voor een specifiek ELEMENT:
    try {
        const element = document.getElementById(id);
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(element)) {
            // Controleer de lengte van ARGUMENT KEY en het ATTRIBUTE zelf:
            if (key.length > 0 && element.getAttribute("accesskey") !== key) {
                element.setAttribute("accesskey", key);
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setAccessKeyForId: " + err.message);
    }
}

function setRoleLabelForId(id, role, label) {
    "use strict";
    // Stel een LABEL in voor een specifiek ELEMENT:
    try {
        const element = document.getElementById(id);
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(element)) {
            // Controleer de lengte van ARGUMENT LABEL:
            if (label.length > 0) {
                // Bestaat het LABEL al en is deze hetzelfde als wat je gaat
                // toewijzen? Dan overslaan:
                if (element.getAttribute("aria-label") !== label) {
                    element.setAttribute("aria-label", label);
                }
            }
            // Controleer de lengte van ARGUMENT ROLE:
            if (role.length > 0) {
                // Bestaat de ROLE al en is deze hetzelfde als wat je gaat
                // toewijzen? Dan overslaan:
                if (element.getAttribute("role") !== role) {
                    element.setAttribute("role", role);
                }
            }
        }
    } catch (err) {
        // Functienaam en foutmelding naar de CONSOLE sturen:
        debugConsoleMessage(1, 1, "setRoleLabelForId: " + err.message);
    }
}

function setTitleForId(id, title) {
    // Stelt een TITEL in voor een uniek ELEMENT:
    try {
        const element = document.getElementById(id);
        // Controleer of de VARIABELE een ELEMENT kent:
        if (check(element)) {
            // Controleer de lengte van ARGUMENT TITEL:
            if (title.length > 0) {
                // Bestaat de TITLE al en is deze hetzelfde als wat je gaat
                // toewijzen? Dan overslaan:
                if (element.getAttribute("title") !== title) {
                    element.setAttribute("title", title);
                }
            }
        }
    } catch (err) {
        debugConsoleMessage(1, "setTitleForId: " + err.message);
    }
}
