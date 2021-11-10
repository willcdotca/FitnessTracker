class Gym {
  constructor() {
    this.data = {};

    this.menu = document.getElementById('menu');
    this.sectionBack = document.getElementById('sectionBack');
    this.menuButton = document.getElementById('menuButton');
    this.exerciseBack = document.getElementById('exerciseBack');
    this.exerciseSlider = document.getElementById("exerciseSlider")
    this.setSlider = document.getElementById("setSlider")

    //Sections (main menu)
    this.sectionContainer = document.getElementById('sectionContainer');
    this.sectionButtons = this.sectionContainer.querySelectorAll('a');

    //Exercises
    this.exerciseContainer = document.getElementById('exerciseContainer');
    this.exercisesList = document.getElementById('exercisesList');
    this.exerciseButton = document.getElementById('addExercise');
    this.exerciseName = document.getElementById('exerciseName');
    this.exerciseDescription = document.getElementById('exerciseDescription');
    this.exerciseVideo = document.getElementById('exerciseVideo');
    this.emptyExercises = document.getElementById('emptyExercises');
    this.addExerciseContainer = document.getElementById('addExerciseContainer');
    this.cancelExerciseButton = document.getElementById('cancelExerciseButton');

    //Sets
    this.setContainer = document.getElementById('setContainer');
    this.addSetButton = document.getElementById('addSetButton');
    this.setHeading = document.getElementById('setHeading');
    this.setDescription = document.getElementById('setDescription');
    this.setVideo = document.getElementById('setVideo');
    this.setReps = document.getElementById('setReps');
    this.setWeight = document.getElementById('setWeight');
    this.setDate = document.getElementById('setDate');
    this.setList = document.getElementById('setList');
    this.emptySets = document.getElementById('emptySets');
    this.addSetContainer = document.getElementById('addSetContainer');
    this.cancelSetButton = document.getElementById('cancelSetButton');

    this.currentContainer = this.sectionContainer;
    this.parentContainer = false;
    this.currentType = false;

    this.alarmSound = document.getElementById('alarmSound');
    this.activeTimer = false;

  }

  init() {
    this.sectionBack.addEventListener('click', () => {
      this.sectionBack.classList.remove('active')
      this.exerciseBack.classList.remove('active')
      this.showContainer(this.sectionContainer);
    });

    this.setSlider.addEventListener('click',()=>{
      this.addSetContainer.classList.toggle('slideIn')


    })
    this.exerciseSlider.addEventListener('click',()=>{
      this.addExerciseContainer.classList.toggle('slideIn')
    })

    this.cancelExerciseButton.addEventListener('click',()=>{
      this.addExerciseContainer.classList.toggle('slideIn')
    })
    this.cancelSetButton.addEventListener('click',()=>{
      this.addSetContainer.classList.toggle('slideIn')
    })


    this.exerciseBack.addEventListener('click', () => {
      this.exerciseBack.classList.remove('active')
      this.loadExercises(this.currentType)
      this.showContainer(this.exerciseContainer);
    });

    this.menuButton.addEventListener('click',ev=>{
      this.menu.classList.toggle('active')
      const isActive = this.menu.classList.contains('active')
      this.sectionBack.disabled = isActive
      this.exerciseBack.disabled = isActive


    })

    this.sectionButtons.forEach(el => {
      this.loadSection(el.id);
      el.addEventListener('click', () => {
        this.currentType = el.id;
        this.sectionBack.classList.add('active')
        this.showContainer(this.exerciseContainer);
        this.loadExercises(el.id);
      });
    });

    this.exerciseButton.addEventListener('click', () => this.addExercise());
    this.addSetButton.addEventListener('click', () => this.addSet());
  }

  loadSection(sectionName) {
    const sectionStorage = localStorage.getItem(sectionName);
    this.data[sectionName] = sectionStorage !== null ? JSON.parse(sectionStorage) : {exercises: {}};
  }

  saveData(name) {
    localStorage.setItem(name, JSON.stringify(this.data[name]));
  }

  formatSetDate(date) {
    date = date ? new Date(date) : new Date()

    return `${date.getUTCFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().
        toString().
        padStart(2, '0')}`;
  }

  formatDisplayDate(date) {
    let split = date.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const cleanDate = new Date(split[0], split[1] - 1, split[2]);
    return `${months[cleanDate.getMonth()]} ${cleanDate.getUTCDate()}, ${cleanDate.getUTCFullYear()}`;
  }

  cleanName(name) {
    return name.replace(/\W/gi, '');
  }

  showContainer(newContainer) {
    this.parentContainer = this.currentContainer;
    this.currentContainer = newContainer;
    this.parentContainer.classList.remove('active');
    this.currentContainer.classList.add('active');
  }

  loadExercises(name) {
    let exercises = this.data[name].exercises;

    !Object.values(exercises).length ?
        this.emptyExercises.classList.add('active') :
        this.emptyExercises.classList.remove('active');
    this.exercisesList.innerHTML = '';
    for (let exercise in exercises) {
      this.generateExerciseButton(exercise, exercises[exercise].name);
    }

  }

  addExercise() {
    if(!this.exerciseName.value) return

    this.data[this.currentType].exercises[this.cleanName(this.exerciseName.value)] = {
      name: this.exerciseName.value,
      description: this.exerciseDescription.value,
      video: this.exerciseVideo.value.length ? this.exerciseVideo.value : false,
      sets: {},
    };

    this.saveData(this.currentType);
    this.emptyExercises.classList.remove('active');
    this.generateExerciseButton(this.exerciseName.value);
    this.exerciseName.value = '';
    this.exerciseVideo.value = '';
    this.exerciseDescription.value = '';
  }

  generateExerciseButton(name, originalName) {
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.href = '#';
    a.innerText = originalName || name;

    a.addEventListener('click', () => {
      this.setContainer.dataset.exercise = this.cleanName(name);
      this.exerciseBack.classList.add('active')
      this.showContainer(this.setContainer);
      this.loadSets(name);
    });
    li.append(a);
    this.exercisesList.append(li);

  }

  loadSets() {
    this.setList.innerHTML = '';
    this.setVideo.classList.remove('active');
    let exercise = this.setContainer.dataset.exercise;
    let currentExercise = this.data[this.currentType].exercises[exercise];
    let dates = currentExercise.sets;

    !Object.values(dates).length ? this.emptySets.classList.add('active') : this.emptySets.classList.remove('active');

    this.setDate.value = this.formatSetDate();
    this.exercisesList.innerHTML = '';
    this.setHeading.innerText = exercise;
    this.setDescription.innerText = currentExercise.description;

    if (currentExercise.video) {
      this.setVideo.classList.add('active');
      this.setVideo.src = `https://www.youtube.com/embed/${currentExercise.video}`;
    }

    for (let date in dates) {
      for (let set in dates[date]) {
        this.generateSet(date, dates[date][set]);
      }
    }
  }

  generateSet(date, set) {
    const currentDate = document.getElementById(date);
    const li = document.createElement('li');

    const p = document.createElement('p');

    const strong = document.createElement('strong');
    strong.innerText = `Set ${set.count}`;
    const span = document.createElement('span');
    span.innerText = `${set.reps} x ${set.weight}lbs`;

    if (!currentDate) {
      li.id = date;

      const h3 = document.createElement('h3')

      h3.innerText = this.formatDisplayDate(date);

      let timer = document.createElement('button');
      timer.innerHTML = 'Begin Rest';

      timer.addEventListener('click', () => {

        if (!this.alarmSound.paused) {
          this.alarmSound.pause();
          timer.disabled = true;
          timer.innerText = 'Rest Complete';
          return;
        }

        if (this.activeTimer) {
          clearInterval(this.activeTimer);
          timer.innerHTML = 'Begin Rest';
          this.activeTimer = false;
        } else {
          timer.innerHTML = '90 seconds remaining';
          let currentTime = 9000;
          this.activeTimer = setInterval(() => {
            if (currentTime === 0) {
              this.alarmSound.currentTime = 0;
              this.alarmSound.play();
              clearInterval(this.activeTimer);
              this.activeTimer = false;
              return;
            }
            currentTime -= 1000;
            timer.innerHTML = `${Math.floor(currentTime / 1000)} seconds remaining`;

          }, 1000);
        }
      });
      p.append(strong);
      p.append(span);
      li.append(h3);
      li.append(p);
      li.append(timer);
      this.setList.append(li);

    } else {
      p.append(strong);
      p.append(span);
      currentDate.querySelector('button').before(p);

    }

  }

  addSet() {
    if(!this.setReps.value || !this.setWeight.value) return
    const exercises = this.data[this.currentType].exercises[this.setContainer.dataset.exercise];

    const setDate = this.formatSetDate(this.setDate.value);
    if (!exercises.sets.hasOwnProperty(setDate)) exercises.sets[setDate] = [];

    let single = {
      reps: this.setReps.value,
      weight: this.setWeight.value,
      count: exercises.sets[setDate].length + 1 || 1,
      complete: false,
    };

    exercises.sets[setDate].push(single);

    this.saveData(this.currentType);
    this.emptySets.classList.remove('active');
    this.generateSet(setDate, single);
  }
}

let gym = new Gym();
gym.init();



if (!window.location.origin.includes('localhost')) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
}
