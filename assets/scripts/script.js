class Gym {
  constructor() {
    this.data = {};

    this.currentTime = 0;

    // #menu
    this.weightType = document.getElementById('weightType');
    this.restingDefault = document.getElementById('restingDefault');
    this.menu = document.getElementById('menu');
    this.menuButton = document.getElementById('menuButton');
    this.clearStorage = document.getElementById('clearStorage');

    //Sections (main menu)
    this.sectionBack = document.getElementById('sectionBack');
    this.sectionContainer = document.getElementById('sectionContainer');
    this.sectionButtons = this.sectionContainer.querySelectorAll('a');

    //Exercises
    this.exerciseBack = document.getElementById('exerciseBack');
    this.exerciseSlider = document.getElementById('exerciseSlider');
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
    this.setSlider = document.getElementById('setSlider');
    this.emptySets = document.getElementById('emptySets');
    this.addSetContainer = document.getElementById('addSetContainer');
    this.cancelSetButton = document.getElementById('cancelSetButton');
    this.alarmSound = document.getElementById('alarmSound');
    this.currentContainer = this.sectionContainer;
    this.parentContainer = false;
    this.currentType = false;
    this.timerCompleted = false;
    this.activeTimer = false;

  }

  init() {
    this.sectionBack.addEventListener('click', () => {
      this.sectionBack.classList.remove('active');
      this.exerciseBack.classList.remove('active');
      this.showContainer(this.sectionContainer);
    });

    this.currentTime = this.restingDefault.value * 60 * 1000;
    this.restingDefault.addEventListener('change', ev => {
      this.currentTime = this.restingDefault.value * 60 * 1000;
    });

    this.setSlider.addEventListener('click', () => {
      this.addSetContainer.classList.toggle('slideIn');
      this.setSlider.innerText = this.addSetContainer.classList.contains('slideIn') ? '-' : '+'


    });
    this.exerciseSlider.addEventListener('click', () => {
      this.addExerciseContainer.classList.toggle('slideIn');
      this.exerciseSlider.innerText = this.addExerciseContainer.classList.contains('slideIn') ? '-' : '+'
    });

    this.cancelExerciseButton.addEventListener('click', () => {
      this.addExerciseContainer.classList.toggle('slideIn');
      this.exerciseSlider.innerText = '+'
    });
    this.cancelSetButton.addEventListener('click', () => {
      this.addSetContainer.classList.toggle('slideIn');
      this.setSlider.innerText = '+'
    });

    this.exerciseBack.addEventListener('click', () => {
      this.exerciseBack.classList.remove('active');
      this.loadExercises(this.currentType);
      this.showContainer(this.exerciseContainer);
    });

    this.menuButton.addEventListener('click', ev => {
      this.menu.classList.toggle('active');
      const isActive = this.menu.classList.contains('active');
      this.sectionBack.disabled = isActive;
      this.exerciseBack.disabled = isActive;

    });

    this.sectionButtons.forEach(el => {
      this.loadSection(el.id);
      el.addEventListener('click', () => {
        this.currentType = el.id;
        this.sectionBack.classList.add('active');
        this.showContainer(this.exerciseContainer);
        this.loadExercises(el.id);
      });
    });

    this.exerciseButton.addEventListener('click', () => this.addExercise());
    this.addSetButton.addEventListener('click', () => this.addSet());
    this.clearStorage.addEventListener('click', () => {
      const confirmed = confirm('Are you sure you want to remove ALL data?');
      if (confirmed) {
        console.log('clear');
        localStorage.clear();
        window.location.reload();
      }
    });
  }

  loadSection(sectionName) {
    const sectionStorage = localStorage.getItem(sectionName);
    this.data[sectionName] = sectionStorage !== null ?
        JSON.parse(sectionStorage) :
        {exercises: {}};
  }

  saveData(name) {

    localStorage.setItem(name, JSON.stringify(this.data[name]));
  }

  formatSetDate(date) {
    date = date ? new Date(date) : new Date();

    return `${date.getUTCFullYear()}-${(date.getMonth() + 1).toString().
        padStart(2, '0')}-${date.getUTCDate().
        toString().
        padStart(2, '0')}`;
  }

  formatDisplayDate(date) {
    let split = date.split('-');
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec'];
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
    if (!this.exerciseName.value) return;

    this.data[this.currentType].exercises[this.cleanName(
        this.exerciseName.value)] = {
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
      this.exerciseBack.classList.add('active');
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

    !Object.values(dates).length ?
        this.emptySets.classList.add('active') :
        this.emptySets.classList.remove('active');

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
        this.generateSet(date, dates[date][set], exercise);
      }
    }
  }

  toggleSet(date, set, exercise) {
    const toggleComplete = document.createElement('a');
    toggleComplete.innerText = '✅';
    toggleComplete.classList.add('toggleComplete');
    toggleComplete.dataset.section = this.currentType;
    toggleComplete.dataset.exercise = exercise;
    toggleComplete.dataset.date = date;
    toggleComplete.dataset.count = set.count;

    if (set.complete) toggleComplete.classList.add('complete');
    toggleComplete.addEventListener('click', ev => {
      if (this.timerCompleted) return;
      const link = ev.target;
      let completed = this.data[link.dataset.section].exercises[link.dataset.exercise].sets[link.dataset.date][parseInt(
          link.dataset.count) - 1];
      completed.complete = !completed.complete;

      if (!completed.complete) {
        toggleComplete.parentElement.parentElement.classList.remove('complete');
      } else {
        toggleComplete.parentElement.parentElement.classList.add('complete');
        toggleComplete.parentElement.parentElement.after(this.createTimer());
      }

      this.saveData(this.currentType);

    });
    return toggleComplete;
  }

  removeSet(date, set, exercise) {

    const removeSet = document.createElement('a');
    removeSet.innerText = '❎';
    removeSet.classList.add('removeSet');

    removeSet.dataset.section = this.currentType;
    removeSet.dataset.exercise = exercise;
    removeSet.dataset.date = date;
    removeSet.dataset.count = set.count;
    removeSet.addEventListener('click', ev => {
      if (this.timerCompleted) return;
      const link = ev.target;
      if (link.parentElement.parentElement.classList.contains(
          'complete')) return;
      let response = confirm('Are you sure you want to delete this set?');

      if (response) {
        this.data[link.dataset.section].exercises[link.dataset.exercise].sets[link.dataset.date].splice(
            parseInt(link.dataset.count) - 1, 1);
        this.data[link.dataset.section].exercises[link.dataset.exercise].sets[link.dataset.date].map(
            (a, b) => {
              a.count = b + 1;
              return a;
            });

        this.saveData(link.dataset.section);
        removeSet.parentElement.parentElement.parentElement.removeChild(
            removeSet.parentElement.parentElement);
        this.loadSets();

      }
    });
    return removeSet;
  }

  createTimer() {
    this.timerCompleted = true;
    let p = document.createElement('p');
    p.id = 'setTimer';

    let div = document.createElement('div');
    let strong = document.createElement('strong');

    strong.innerText = `Rest Remaining: ${this.currentTime / 1000}s`;

    let reset = document.createElement('button');
    reset.id = 'resetTimer';
    reset.innerHTML = 'Restart Rest';

    let pause = document.createElement('button');
    pause.innerHTML = 'Pause Rest';
    pause.id = 'pauseTimer';

    let finish = document.createElement('button');
    finish.innerHTML = 'Finish Rest';
    finish.id = 'finishRest';

    finish.addEventListener('click', ev => {
      this.currentTime = this.restingDefault.value * 60 * 1000;
      this.timerCompleted = false;
      this.alarmSound.pause();
      this.alarmSound.currentTime = 0;

      finish.parentElement.parentElement.removeChild(finish.parentElement);
    });

    pause.addEventListener('click', ev => {
      if (this.activeTimer) {
        clearInterval(this.activeTimer);
        this.activeTimer = false;
        pause.innerHTML = 'Start';
      } else {
        console.log('rerunning pause');
        pause.innerHTML = 'Pause Rest';
        this.beginTimer(strong);

      }
    });

    reset.addEventListener('click', () => {
      clearInterval(this.activeTimer);
      this.activeTimer = false;
      this.currentTime = this.restingDefault.value * 60 * 1000;
      strong.innerText = `Rest Remaining: ${this.currentTime / 1000}s`;
      pause.innerHTML = 'Start';

    });
    p.append(strong);
    div.append(reset);
    div.append(pause);
    p.append(finish);
    p.append(div);
    this.beginTimer(strong);
    return p;
  }

  beginTimer(strong) {
    this.activeTimer = setInterval(() => {
      if (this.currentTime === 1000) {
        this.alarmSound.currentTime = 0;
        this.alarmSound.play();
        clearInterval(this.activeTimer);
        this.activeTimer = false;
        strong.parentElement.classList.add('finished');
        return;
      }
      this.currentTime -= 1000;
      strong.innerHTML = `Rest Remaining: ${this.currentTime / 1000}s`;
    }, 1000);
  }

  generateSet(date, set, exercise) {
    const currentDate = document.getElementById(date);
    const li = document.getElementById(date) ?? document.createElement('li');
    const p = document.createElement('p');

    const strong = document.createElement('strong');
    strong.innerText = `Set ${set.count}`;
    const span = document.createElement('span');
    span.innerText = `${set.reps} x ${set.weight}${this.weightType.value}`;

    const toggleComplete = this.toggleSet(date, set, exercise);
    const removeSet = this.removeSet(date, set, exercise);

    !set.complete ?
        p.classList.remove('complete') :
        p.classList.add('complete');

    if (!currentDate) {
      li.id = date;
      const h3 = document.createElement('h3');
      h3.innerText = this.formatDisplayDate(date);
      li.append(h3);
      li.append(p);
      this.setList.append(li);
    }

    p.append(strong);
    p.append(span);

    const d = document.createElement('div');

    d.appendChild(toggleComplete);
    d.appendChild(removeSet);
    p.appendChild(d);
    li.append(p);

  }

  addSet() {
    if (!this.setReps.value || !this.setWeight.value) return;
    const exercises = this.data[this.currentType].exercises[this.setContainer.dataset.exercise];

    const setDate = this.formatSetDate(this.setDate.value);
    if (!exercises.sets.hasOwnProperty(setDate)) exercises.sets[setDate] = [];

    const count = exercises.sets[setDate].length + 1 || 1;
    let single = {
      reps: this.setReps.value,
      weight: this.setWeight.value,
      count: count,
      complete: false,
    };

    exercises.sets[setDate].push(single);

    this.saveData(this.currentType);
    this.emptySets.classList.remove('active');
    this.generateSet(setDate, single, this.setContainer.dataset.exercise);
  }

}

let gym = new Gym();
gym.init();

if (!window.location.origin.includes('localhost')) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
}
