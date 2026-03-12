/* =========================================
   Codificando Ideias Analytics Layer
========================================= */

(function(){

function generateSessionId(){
return Math.random().toString(36).substring(2,12);
}

function getUTM(){

const params = new URLSearchParams(window.location.search);

return {

utm_source: params.get("utm_source"),
utm_medium: params.get("utm_medium"),
utm_campaign: params.get("utm_campaign"),
utm_content: params.get("utm_content"),
utm_term: params.get("utm_term")

};

}

function getClaritySessionId(){

const cookies = document.cookie.split(";");

for(let cookie of cookies){

cookie = cookie.trim();

if(cookie.startsWith("_clck=")){

const value = cookie.split("=")[1];

return value.split("|")[0];

}

}

return null;

}

function initSession(){

let sessionId = localStorage.getItem("ci_session_id");

if(!sessionId){

sessionId = generateSessionId();
localStorage.setItem("ci_session_id", sessionId);

}

let sessionStart = localStorage.getItem("ci_session_start");

if(!sessionStart){

sessionStart = Date.now();
localStorage.setItem("ci_session_start", sessionStart);

}

const utm = getUTM();

const analytics = {

session_id: sessionId,

clarity_session_id: getClaritySessionId(),

session_start: new Date(parseInt(sessionStart)).toISOString(),

utm_source: utm.utm_source,
utm_medium: utm.utm_medium,
utm_campaign: utm.utm_campaign,
utm_content: utm.utm_content,
utm_term: utm.utm_term,

referrer: document.referrer || "direct",

landing_page: window.location.pathname,

scrolled_50: false,
scrolled_90: false,

cta_clicked: null,
menu_clicked: null,

service_clicked: null,
problem_clicked: null,
contract_model_clicked: null,

form_viewed: false,
form_started: false,
form_submitted: false,

engaged_30s: false,
engaged_60s: false

};

window.ciAnalytics = analytics;

}

function updateAnalytics(key,value){

if(!window.ciAnalytics) return;

window.ciAnalytics[key] = value;

}

async function saveAnalyticsLead(leadId){

if(!window.ciAnalytics) return;

const start = localStorage.getItem("ci_session_start");

const duration = Math.floor((Date.now() - start)/1000);

const payload = {

lead_id: leadId,

...window.ciAnalytics,

session_duration: duration

};

const { error } = await supabase
.from("analytics_leads")
.insert([payload]);

if(error){

console.error("analytics error:",error);

}

}

window.updateAnalytics = updateAnalytics;
window.saveAnalyticsLead = saveAnalyticsLead;

initSession();

})();