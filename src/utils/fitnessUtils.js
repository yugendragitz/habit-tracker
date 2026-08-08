/**
 * fitnessUtils.js - Workout analytics & Personal Record (PR) engine for MOMENTUM
 */

// Calculate total workout metrics (totalVolume, totalSets, totalReps, muscleGroups)
export const calculateWorkoutSummary = (exercises = []) => {
  let totalVolume = 0;
  let totalSets = 0;
  let totalReps = 0;
  const muscleGroupsSet = new Set();

  exercises.forEach(ex => {
    (ex.sets || []).forEach(set => {
      const weight = Number(set.weightKg) || 0;
      const reps = Number(set.reps) || 0;
      if (reps > 0) {
        totalSets++;
        totalReps += reps;
        totalVolume += (weight * reps);
      }
    });
    if (ex.muscleGroups) {
      ex.muscleGroups.forEach(m => muscleGroupsSet.add(m));
    }
  });

  return {
    totalVolume: Math.round(totalVolume),
    totalSets,
    totalReps,
    muscleGroupsTrained: Array.from(muscleGroupsSet),
  };
};

// Detect Personal Records across historical workouts
export const detectPersonalRecords = (allWorkouts = {}) => {
  // Map of exerciseId -> { maxWeightKg, maxRepsAtMaxWeight, maxVolumeSet, dateAchieved }
  const prMap = {};

  // Sort workouts chronologically
  const dateKeys = Object.keys(allWorkouts).sort();

  dateKeys.forEach(dateStr => {
    const workoutList = allWorkouts[dateStr] || [];
    workoutList.forEach(workout => {
      (workout.exercises || []).forEach(ex => {
        const exId = ex.exerciseId || ex.name;
        if (!prMap[exId]) {
          prMap[exId] = {
            exerciseId: exId,
            exerciseName: ex.name,
            maxWeightKg: 0,
            maxRepsAtMaxWeight: 0,
            maxVolumeSet: 0,
            dateAchieved: dateStr,
          };
        }

        (ex.sets || []).forEach(set => {
          const w = Number(set.weightKg) || 0;
          const r = Number(set.reps) || 0;
          const setVol = w * r;

          let isNewPR = false;

          // Check if weight PR
          if (w > prMap[exId].maxWeightKg) {
            prMap[exId].maxWeightKg = w;
            prMap[exId].maxRepsAtMaxWeight = r;
            prMap[exId].dateAchieved = dateStr;
            isNewPR = true;
          } else if (w === prMap[exId].maxWeightKg && r > prMap[exId].maxRepsAtMaxWeight) {
            prMap[exId].maxRepsAtMaxWeight = r;
            prMap[exId].dateAchieved = dateStr;
            isNewPR = true;
          }

          // Check if set volume PR
          if (setVol > prMap[exId].maxVolumeSet) {
            prMap[exId].maxVolumeSet = setVol;
            isNewPR = true;
          }

          set.isPR = isNewPR;
        });
      });
    });
  });

  return prMap;
};

// Format volume nicely (e.g. 4,820 kg)
export const formatVolume = (volumeKg) => {
  return (volumeKg || 0).toLocaleString('en-US') + ' kg';
};
