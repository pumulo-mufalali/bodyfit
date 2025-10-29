export interface Exercise {
  id: string;
  name: string;
  imageUrl: string;
}

export interface ExerciseCategory {
  category: string;
  exercises: Exercise[];
}

export const exerciseCategories: ExerciseCategory[] = [
  {
    category: 'Cardio',
    exercises: [
      { id: 'ex1', name: 'Overhead Reach', imageUrl: 'https://media.self.com/photos/61157d860fba8918ef07da15/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-01%2520Squat%2520to%2520Overhead%2520Reach-min.gif' },
      { id: 'ex2', name: 'Jumping Jacks', imageUrl: 'https://media.self.com/photos/61157e25553830ba14166ef2/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-02%2520Modified%2520Jumping%2520Jacks-min.gif' },
      { id: 'ex3', name: 'Ice Skaters', imageUrl: 'https://media.self.com/photos/611581f6c66629131d52d34f/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-13%2520Ice%2520Skaters-min.gif' },
      { id: 'ex4', name: 'Toe Taps With Reach', imageUrl: 'https://media.self.com/photos/61157ed6e1b6f66010ac3706/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-04%2520Toe%2520Taps%2520With%2520Reach-min.gif' },
    ]
  },
  {
    category: 'Arms',
    exercises: [
      { id: 'ex5', name: 'Tricep Box Dips', imageUrl: 'https://media.self.com/photos/5c4a2f33203e3933090ec27b/master/w_1600%2Cc_limit/tricep-box-dips-Amanda_093.gif' },
      { id: 'ex6', name: 'Elevated Push Ups', imageUrl: 'https://media.self.com/photos/5c4a2e2601584d32459c06ce/master/w_1600%2Cc_limit/elevated-push-up-Amanda_091.gif' },
      { id: 'ex7', name: 'Diamond Push Ups', imageUrl: 'https://media.self.com/photos/5c41fa45a9cd1e7eb7fd0f2b/master/w_1600%2Cc_limit/diamond-push-up-Amanda_079.gif' },
      { id: 'ex8', name: 'Plank With T Rotation', imageUrl: 'https://media.self.com/photos/5c4b2809a9cd1e7eb7fd0f4d/master/w_1600%2Cc_limit/plank-with-t-rotation-Amanda_041.gif' },
    ]
  },
  {
    category: 'Legs',
    exercises: [
      { id: 'ex9', name: 'Split Squats', imageUrl: 'https://barbend.com/wp-content/uploads/2023/04/split-squat-barbend-movement-gif-masters.gif' },
      { id: 'ex10', name: 'Smith Machine Calf Raises', imageUrl: 'https://barbend.com/wp-content/uploads/2024/04/smith-machine-calf-raise-barbend-movement-gif-masters-1.gif' },
      { id: 'ex11', name: 'Nordic Hamstring Curls', imageUrl: 'https://barbend.com/wp-content/uploads/2023/03/nordic-hamstring-curl-barbend-movement-gif-masters.gif' },
      { id: 'ex12', name: 'Goblet Squats', imageUrl: 'https://barbend.com/wp-content/uploads/2023/12/goblet-squat-barbend-movement-gif-masters.gif' },
    ]
  },
  {
    category: 'Abs',
    exercises: [
      { id: 'ex13', name: 'Crunches', imageUrl: 'https://i.imgur.com/UJAnRhJ.gif' },
      { id: 'ex14', name: 'Russian Twist', imageUrl: 'https://i.imgur.com/PG6vgpl.gif' },
      { id: 'ex15', name: 'Side Jack-Knife', imageUrl: 'https://i.imgur.com/HjyLvkX.gif' },
      { id: 'ex16', name: 'Jack-knife ', imageUrl: 'https://i.imgur.com/CBH7Ejv.gif' },
    ]
  },
  {
    category: 'Stretches',
    exercises: [
      { id: 'ex17', name: 'Yoga Flow', imageUrl: 'https://assets.vogue.com/photos/5891df45fb0604bf1f5c6056/master/w_1600,c_limit/karlie-stretch-1.gif' },
      { id: 'ex18', name: 'Hamstring Stretch', imageUrl: 'https://assets.vogue.com/photos/5891df4a9c1609bf7a72e2eb/master/w_1600,c_limit/karlie-stretch-4.gif' },
      { id: 'ex19', name: 'Shoulder Stretch', imageUrl: 'https://assets.vogue.com/photos/5891df4b12a7b1df212c840d/master/w_1600,c_limit/karlie-stretch-5.gif' },
      { id: 'ex20', name: 'Neck Stretch', imageUrl: 'https://assets.vogue.com/photos/5891df48fb0604bf1f5c6058/master/w_1600,c_limit/karlie-stretch-3.gif' },
    ]
  },
];