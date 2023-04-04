// To parse this data:
//
//   import { Convert } from "./file";
//
//   const temtemsResponse = Convert.totemtemsResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface temtemsResponse {
    number:                    number;
    name:                      string;
    types:                     TypeElement[];
    portraitWikiUrl:           string;
    lumaPortraitWikiUrl:       string;
    wikiUrl:                   string;
    stats:                     { [key: string]: number };
    traits:                    string[];
    details:                   Details;
    techniques:                Technique[];
    trivia:                    string[];
    evolution:                 Evolution;
    wikiPortraitUrlLarge:      string;
    lumaWikiPortraitUrlLarge:  string;
    locations:                 Location[];
    icon:                      string;
    lumaIcon:                  string;
    genderRatio:               GenderRatio;
    catchRate:                 number;
    hatchMins:                 number;
    tvYields:                  { [key: string]: number };
    gameDescription:           string;
    wikiRenderStaticUrl:       string;
    wikiRenderAnimatedUrl:     string;
    wikiRenderStaticLumaUrl:   string;
    wikiRenderAnimatedLumaUrl: string;
    renderStaticImage:         string;
    renderStaticLumaImage:     string;
    renderAnimatedImage:       string;
    renderAnimatedLumaImage:   string;
}

export interface Details {
    height: Height;
    weight: Weight;
}

export interface Height {
    cm:     number;
    inches: number;
}

export interface Weight {
    kg:  number;
    lbs: number;
}

export interface Evolution {
    evolves:        boolean;
    stage?:         number;
    evolutionTree?: EvolutionTree[];
    type?:          EvolutionTreeType;
    from?:          EvolutionTree | null;
    to?:            EvolutionTree | null;
    number?:        number;
    name?:          string;
    level?:         number;
    trading?:       boolean;
    traits?:        string[];
    traitMapping?:  { [key: string]: string };
    description?:   string;
}

export interface EvolutionTree {
    stage:        number;
    number:       number;
    name:         string;
    level:        number;
    type:         EvolutionTreeType;
    trading:      boolean;
    traits:       string[];
    traitMapping: { [key: string]: string };
    description?: string;
}

export enum EvolutionTreeType {
    Levels = "levels",
    Special = "special",
    Trade = "trade",
}

export interface GenderRatio {
    male:   number;
    female: number;
}

export interface Location {
    location:  string;
    place:     string;
    note:      Note;
    island:    Island;
    frequency: string;
    level:     string;
    freetem:   Freetem;
}

export interface Freetem {
    minLevel:   number;
    maxLevel:   number;
    minPansuns: number | null;
    maxPansuns: number | null;
}

export enum Island {
    Arbury = "Arbury",
    Cipanku = "Cipanku",
    Deniz = "Deniz",
    Kisiwa = "Kisiwa",
    Omninesia = "Omninesia",
    Tucma = "Tucma",
}

export enum Note {
    Dojo = "Dojo",
    Empty = "",
}

export interface Technique {
    name:    string;
    source:  Source;
    levels?: number;
}

export enum Source {
    Breeding = "Breeding",
    Levelling = "Levelling",
    TechniqueCourses = "TechniqueCourses",
}

export enum TypeElement {
    Crystal = "Crystal",
    Digital = "Digital",
    Earth = "Earth",
    Electric = "Electric",
    Fire = "Fire",
    Melee = "Melee",
    Mental = "Mental",
    Nature = "Nature",
    Neutral = "Neutral",
    Toxic = "Toxic",
    Water = "Water",
    Wind = "Wind",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static totemtemsResponse(json: string): temtemsResponse[] {
        return cast(JSON.parse(json), a(r("temtemsResponse")));
    }

    public static temtemsResponseToJson(value: temtemsResponse[]): string {
        return JSON.stringify(uncast(value, a(r("temtemsResponse"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "temtemsResponse": o([
        { json: "number", js: "number", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "types", js: "types", typ: a(r("TypeElement")) },
        { json: "portraitWikiUrl", js: "portraitWikiUrl", typ: "" },
        { json: "lumaPortraitWikiUrl", js: "lumaPortraitWikiUrl", typ: "" },
        { json: "wikiUrl", js: "wikiUrl", typ: "" },
        { json: "stats", js: "stats", typ: m(0) },
        { json: "traits", js: "traits", typ: a("") },
        { json: "details", js: "details", typ: r("Details") },
        { json: "techniques", js: "techniques", typ: a(r("Technique")) },
        { json: "trivia", js: "trivia", typ: a("") },
        { json: "evolution", js: "evolution", typ: r("Evolution") },
        { json: "wikiPortraitUrlLarge", js: "wikiPortraitUrlLarge", typ: "" },
        { json: "lumaWikiPortraitUrlLarge", js: "lumaWikiPortraitUrlLarge", typ: "" },
        { json: "locations", js: "locations", typ: a(r("Location")) },
        { json: "icon", js: "icon", typ: "" },
        { json: "lumaIcon", js: "lumaIcon", typ: "" },
        { json: "genderRatio", js: "genderRatio", typ: r("GenderRatio") },
        { json: "catchRate", js: "catchRate", typ: 0 },
        { json: "hatchMins", js: "hatchMins", typ: 3.14 },
        { json: "tvYields", js: "tvYields", typ: m(0) },
        { json: "gameDescription", js: "gameDescription", typ: "" },
        { json: "wikiRenderStaticUrl", js: "wikiRenderStaticUrl", typ: "" },
        { json: "wikiRenderAnimatedUrl", js: "wikiRenderAnimatedUrl", typ: "" },
        { json: "wikiRenderStaticLumaUrl", js: "wikiRenderStaticLumaUrl", typ: "" },
        { json: "wikiRenderAnimatedLumaUrl", js: "wikiRenderAnimatedLumaUrl", typ: "" },
        { json: "renderStaticImage", js: "renderStaticImage", typ: "" },
        { json: "renderStaticLumaImage", js: "renderStaticLumaImage", typ: "" },
        { json: "renderAnimatedImage", js: "renderAnimatedImage", typ: "" },
        { json: "renderAnimatedLumaImage", js: "renderAnimatedLumaImage", typ: "" },
    ], false),
    "Details": o([
        { json: "height", js: "height", typ: r("Height") },
        { json: "weight", js: "weight", typ: r("Weight") },
    ], false),
    "Height": o([
        { json: "cm", js: "cm", typ: 0 },
        { json: "inches", js: "inches", typ: 0 },
    ], false),
    "Weight": o([
        { json: "kg", js: "kg", typ: 0 },
        { json: "lbs", js: "lbs", typ: 0 },
    ], false),
    "Evolution": o([
        { json: "evolves", js: "evolves", typ: true },
        { json: "stage", js: "stage", typ: u(undefined, 0) },
        { json: "evolutionTree", js: "evolutionTree", typ: u(undefined, a(r("EvolutionTree"))) },
        { json: "type", js: "type", typ: u(undefined, r("EvolutionTreeType")) },
        { json: "from", js: "from", typ: u(undefined, u(r("EvolutionTree"), null)) },
        { json: "to", js: "to", typ: u(undefined, u(r("EvolutionTree"), null)) },
        { json: "number", js: "number", typ: u(undefined, 0) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "level", js: "level", typ: u(undefined, 0) },
        { json: "trading", js: "trading", typ: u(undefined, true) },
        { json: "traits", js: "traits", typ: u(undefined, a("")) },
        { json: "traitMapping", js: "traitMapping", typ: u(undefined, m("")) },
        { json: "description", js: "description", typ: u(undefined, "") },
    ], false),
    "EvolutionTree": o([
        { json: "stage", js: "stage", typ: 0 },
        { json: "number", js: "number", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "level", js: "level", typ: 0 },
        { json: "type", js: "type", typ: r("EvolutionTreeType") },
        { json: "trading", js: "trading", typ: true },
        { json: "traits", js: "traits", typ: a("") },
        { json: "traitMapping", js: "traitMapping", typ: m("") },
        { json: "description", js: "description", typ: u(undefined, "") },
    ], false),
    "GenderRatio": o([
        { json: "male", js: "male", typ: 0 },
        { json: "female", js: "female", typ: 0 },
    ], false),
    "Location": o([
        { json: "location", js: "location", typ: "" },
        { json: "place", js: "place", typ: "" },
        { json: "note", js: "note", typ: r("Note") },
        { json: "island", js: "island", typ: r("Island") },
        { json: "frequency", js: "frequency", typ: "" },
        { json: "level", js: "level", typ: "" },
        { json: "freetem", js: "freetem", typ: r("Freetem") },
    ], false),
    "Freetem": o([
        { json: "minLevel", js: "minLevel", typ: 0 },
        { json: "maxLevel", js: "maxLevel", typ: 0 },
        { json: "minPansuns", js: "minPansuns", typ: u(0, null) },
        { json: "maxPansuns", js: "maxPansuns", typ: u(0, null) },
    ], false),
    "Technique": o([
        { json: "name", js: "name", typ: "" },
        { json: "source", js: "source", typ: r("Source") },
        { json: "levels", js: "levels", typ: u(undefined, 0) },
    ], false),
    "EvolutionTreeType": [
        "levels",
        "special",
        "trade",
    ],
    "Island": [
        "Arbury",
        "Cipanku",
        "Deniz",
        "Kisiwa",
        "Omninesia",
        "Tucma",
    ],
    "Note": [
        "Dojo",
        "",
    ],
    "Source": [
        "Breeding",
        "Levelling",
        "TechniqueCourses",
    ],
    "TypeElement": [
        "Crystal",
        "Digital",
        "Earth",
        "Electric",
        "Fire",
        "Melee",
        "Mental",
        "Nature",
        "Neutral",
        "Toxic",
        "Water",
        "Wind",
    ],
};
