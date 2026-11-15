// ===== PROGRAM (the only file to change between cycles) =====
// Each item: { id: <exact name from the master index>, rx: "sets × reps", log: true/false }
// Bump `version` when publishing a new cycle — it replaces any in-app edits from the old one.
const B = (title, items, note, cat) => ({ title, note: note || "", cat: cat || "Lifts", items });
const I = (id, rx, log) => ({ id, rx, log: !!log });

const WARM = () => B("Warm-up", [I("Bike/Rower Warm-up","10 min"), I("Dynamic Stretching","5 min")], "", "Warm-up");
const FOOT = () => ["Arch Lifting","Toe Yoga","Towel Scrunches","Toe Spreading","Plantar Fascia Stretch","Great Toe Stretch","Frozen Bottle Roll"].map(n => I(n,"~1 min"));
const COOL = () => B("Cool-down & Foot", [I("Cool-down Cardio","8 min"), ...FOOT(), I("Static Stretching","5 min")], "PT routine · ~7 min · seated", "Foot (PT)");
const CORE_NOTE = "One circuit in one spot · 2 rounds · minimal rest";
const LIFT_NOTE = "Rest 2–3 min on LOG lifts · 60–90 s otherwise";

const PROGRAM = {
  version: 1,
  name: "Cycle 1",
  start: [2026, 11, 15],        // Sun Nov 15, 2026 — out of trial
  offFriday: [2026, 11, 13],    // off every other Friday from Nov 13 (9/80)
  // Day of week → workout key. Friday uses off/on week.
  schedule: { 1: "A", 2: "T", 3: "H", 4: "B", 5: { off: "FO", on: "FN" }, 6: "S", 0: "S" },
  // First-session starting weights by week (used only until a lift has history)
  targets: { "Back Squat":[120,125,130,135], "Deadlift":[155,165,175,185], "Bench Press":[80,85,90,95], "Overhead Press":["Find your weight","+5","+5","+5"] },
  days: {
    A: { label:"Mon · Lower", title:"Lower Body", icon:"lift", est:"75 min",
         about:"Heavy leg day. Squat and deadlift build the hip and leg strength behind climbing, hiking and running. Keep Thursday light so your legs recover before the Friday ride.",
         blocks:[ WARM(),
           B("Lifts",[I("Back Squat","3 × 6–8",1),I("Deadlift","3 × 5",1),I("Bulgarian Split Squat","3 × 8 / leg"),I("Hamstring Curl","2 × 10–12"),I("Standing Calf Raise","3 × 12")], LIFT_NOTE),
           B("Core Circuit",[I("Dead Bug","2 × 10 / side"),I("Side Plank","2 × 30 s / side"),I("Med Ball Russian Twist","2 × 20"),I("Hanging Knee Raise","2 × 10")], CORE_NOTE, "Core"),
           COOL() ] },
    T: { label:"Tue · Flex", title:"Flex Day", icon:"flex", est:"30–60 min",
         about:"Pickleball counts as the workout. No pickleball? Easy cardio or full rest. Either way, get the foot routine in.",
         blocks:[ B("Today",[I("Pickleball / Easy Cardio / Rest","Your call")],"","Cardio"), B("Foot",FOOT(),"PT routine · ~7 min · seated","Foot (PT)") ] },
    H: { label:"Wed · Turf", title:"Turf Circuit", icon:"bolt", est:"60 min",
         about:"Strength and conditioning combined. Grab a kettlebell, a pair of dumbbells and a med ball and set up on the turf. 40 s work / 20 s rest per station, 4 rounds, 90 s between rounds. Round 1 controlled; rounds 3–4 hard. No jumping.",
         blocks:[ WARM(),
           Object.assign(B("Circuit",[I("Kettlebell Swing","40 s"),I("DB Thruster","40 s"),I("Push-up","40 s"),I("Renegade Row","40 s"),I("Goblet Reverse Lunge","40 s"),I("Med Ball Slam","40 s")],"4 rounds · 40 s on / 20 s off · 90 s between rounds","Conditioning"),
             { timer: { work: 40, rest: 20, roundRest: 90, rounds: 4 } }),
           COOL() ] },
    B: { label:"Thu · Upper", title:"Upper Body", icon:"lift", est:"75 min",
         about:"Upper-body strength with light leg work so you're fresh for Friday. Superset dumbbell rows with lateral raises to save time.",
         blocks:[ WARM(),
           B("Lifts",[I("Bench Press","3 × 6–8",1),I("Pull-up","3 × max"),I("Overhead Press","3 × 6–8",1),I("Dumbbell Row","3 × 10"),I("Lateral Raise","2 × 12–15"),I("Seated Calf Raise","3 × 12"),I("Farmer Carry","3 × 40 m")], LIFT_NOTE),
           B("Core Circuit",[I("Hollow Hold","2 × 30 s"),I("Bird Dog","2 × 8 / side"),I("Ab Wheel Rollout","2 × 8"),I("Plank Shoulder Tap","2 × 20")], CORE_NOTE, "Core"),
           COOL() ] },
    FO:{ label:"Fri · Off wk", title:"Long Ride", icon:"bike", est:"2 hr",
         about:"Long, easy aerobic day. Builds the endurance base under everything else. Keep it conversational, then finish with yoga and the foot routine.",
         blocks:[ B("Warm-up",[I("Dynamic Stretching","5 min")],"","Warm-up"), B("Ride",[I("Long Ride or Row","90+ min")],"","Cardio"),
                  B("Yoga & Foot",[I("Yoga","15–20 min"),...FOOT()],"PT routine · ~7 min · seated","Foot (PT)") ] },
    FN:{ label:"Fri · On wk", title:"VO₂ Intervals", icon:"bike", est:"45 min",
         about:"The hardest cardio of the week, kept short. Four hard 4-minute efforts are what push VO₂ max back up.",
         blocks:[ B("Intervals",[I("4×4 Intervals","~40 min")],"","Cardio"), B("Foot",FOOT(),"PT routine · ~7 min · seated","Foot (PT)") ] },
    S: { label:"Weekend", title:"Outdoor or Rest", icon:"trail", est:"Flexible",
         about:"Easy outdoor cardio — run, ride or hike — or full rest. Take at least one rest day each weekend.",
         blocks:[ B("Today",[I("Cardio Mix","Or rest")],"","Cardio"), B("Foot",FOOT(),"PT routine · ~7 min · seated","Foot (PT)") ] }
  }
};
