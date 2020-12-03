// Initialize Firebase
var config = {
    apiKey: "AIzaSyBJ7gJxWQY84_ZxenPlqaufEznzgjsy4Eg",
    authDomain: "train-tracker-f819e.firebaseapp.com",
    databaseURL: "https://train-tracker-f819e.firebaseio.com",
    projectId: "train-tracker-f819e",
    storageBucket: "train-tracker-f819e.appspot.com",
    messagingSenderId: "537399105498"
};

firebase.initializeApp(config);

var trainData = firebase.database();

$('.js-add-train').on('click', function() {
    // event.preventDefault();

    // Get user input
    let trainName = $('.js-train-name-input').val().trim();
    let destination = $('.js-destination-input').val().trim();
    let firstTrain = $('.js-first-train-input').val().trim();
    let frequency = $('.js-frequency-input').val().trim();

    // Add user to a train object
    let newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
    }

    // Upload train data to firebase
    trainData.ref().push(newTrain);

    // Clear all text box fields



    console.log('you clicked submit');
    return false;
});

trainData.ref().on('child_added', function(childSnapshot, prevChildKey) {
    // Store things into a variable
    console.log(childSnapshot.val());

    let tName = childSnapshot.val().name;
    let tDestination = childSnapshot.val().destination;
    let tFirstTrain = childSnapshot.val().firstTrain;
    let tFrequency = childSnapshot.val().frequency;

    let trainArr = tFirstTrain.split(':');
    let trainTime = moment().hours(trainArr[0]).minutes(trainArr[1]);
    let maxMoment = moment.max(moment(), trainTime);
    let trainMinutes;
    let trainArrival;


    console.log('train time: ' + trainTime);
    // If first train is later than current time, set arrival to the first train time

    if (maxMoment === trainTime) {
        trainArrival = trainTime.format('hh:mm A');
        trainMinutes = trainTime.diff(moment(), 'minutes');
    }
    else {
        // Calculate minutes until arrival 
        let differenceInTimes = moment().diff(trainTime, 'minutes');
        let tRemainder = differenceInTimes % tFrequency;
        trainMinutes = tFrequency - tRemainder;

        // Calculate the arrival time
        tArrival = moment().add(trainMinutes, 'm').format('mm:hh A');
    }

    // Add each train's data into the table on the screen
    $('#train-table > tbody').append('<tr><td>' + tName + '</td><td>' + tDestination + '</td><td>' + tFrequency + '</td><td>' + tArrival + '</td><td>' + trainMinutes + '</td><tr>');

});