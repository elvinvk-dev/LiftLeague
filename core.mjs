export const RANKED_EXERCISES = ["Bench press","Squat","Deadlift","Overhead press","Barbell row","Tricep cable pushdowns","Bicep curls","Lateral raises","Pull ups","Preacher curls","T-bar row","Incline bench press","Chest flies","Incline chest flies","Leg press"];
export const KG_PER_LB = 0.45359237;
export function kg(value, unit) { return Number(value) * (unit === 'lb' ? KG_PER_LB : 1); }
export function e1rm(weight, reps) { return weight * (1 + reps / 30); }
// Game calibration, not validated strength standards. Dumbbells use combined load.
export const EXERCISE_FACTORS = {"Bench press":1,"Squat":1.25,"Deadlift":1.4,"Overhead press":0.65,"Barbell row":0.85,"Tricep cable pushdowns":0.55,"Bicep curls":0.45,"Lateral raises":0.2,"Pull ups":1.1,"Preacher curls":0.4,"T-bar row":0.9,"Incline bench press":0.85,"Chest flies":0.4,"Incline chest flies":0.35,"Leg press":2.2};
export const LEAGUES = ['Rookie','Bronze','Silver','Gold','Platinum','Diamond','Titan'];
export const BASE_THRESHOLDS = [15,30,45,60,75,95];
export function canonicalExercise(name) { return RANKED_EXERCISES.find(ex=>ex.toLowerCase()===String(name).trim().toLowerCase())||null; }
export function thresholds(exercise='Bench press') {
 const factor=EXERCISE_FACTORS[canonicalExercise(exercise)]||1;
 return BASE_THRESHOLDS.map(value=>Math.round(value*factor));
}
export function score(logs,height,bodyweight,exercise='Bench press') {
 const overall=String(exercise).trim().toLowerCase()==='overall';
 const name=canonicalExercise(exercise);
 if((!name&&!overall) || !Number.isFinite(Number(height)) || !Number.isFinite(Number(bodyweight)) || height<=0 || bodyweight<=0) return 0;
 const best=new Map();
 for(const log of logs){const movement=canonicalExercise(log.exercise);if(movement&&(overall||movement===name))best.set(movement,Math.max(best.get(movement)||0,e1rm(Number(log.weight_kg),Number(log.reps))));}
 const strength=overall ? RANKED_EXERCISES.reduce((sum,ex)=>sum+(best.get(ex)||0)/EXERCISE_FACTORS[ex],0)/RANKED_EXERCISES.length : (best.get(name)||0);
 return Math.round(strength/bodyweight*Math.sqrt(height/175)*40);
}
export function rank(points,exercise='Bench press') { return LEAGUES[thresholds(exercise).filter(n=>points>=n).length]; }
export function nextLeague(points,exercise='Bench press') {
 const limits=thresholds(exercise), index=limits.findIndex(n=>points<n);
 return index<0 ? null : {name:LEAGUES[index+1],points:limits[index],remaining:limits[index]-points};
}
export function validateBackup(data) {
 if (!data || !Array.isArray(data.plans) || !Array.isArray(data.logs)) throw Error('Expected a LiftLeague backup with plans and logs.');
 if(data.plans.length>500 || data.logs.length>50000) throw Error('Backup is too large.');
 return {plans:data.plans.map(p=>{if(typeof p.name!=='string'||p.name.length>80||typeof p.exercises!=='string'||p.exercises.length>5000)throw Error('Invalid plan');return {id:crypto.randomUUID(),name:p.name,exercises:p.exercises};}),logs:data.logs.map(l=>{if(typeof l.exercise!=='string'||l.exercise.length>80||!(l.weight_kg>0&&l.weight_kg<=1000)||!Number.isInteger(l.reps)||l.reps<1||l.reps>30||!Number.isInteger(l.sets)||l.sets<1||l.sets>30||!/^\d{4}-\d{2}-\d{2}$/.test(l.date))throw Error('Invalid log');return {id:crypto.randomUUID(),exercise:l.exercise,weight_kg:l.weight_kg,reps:l.reps,sets:l.sets,date:l.date};})};
}
