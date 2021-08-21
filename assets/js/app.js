//Selectors 
const tweetBtn = document.getElementById('tweetBtn');
const tweetInput = document.getElementById('tweetInput');

const wordCountEl = document.querySelector('.wordCount');
const tweetsList = document.getElementById('tweets');

const searchInput = document.getElementById('searchItem');

//Event Listners for create tweer
tweetBtn.addEventListener('click', makeTweet);

//searchInput add event listners
searchInput.addEventListener('keyup', searchTweet);


//Data
let wordaCount = 0;
const totalTweetData = getTheLocalTweets();

//Get tweets from the local store
function getTheLocalTweets(){
  items = '';
  if(localStorage.getItem('tweetList') === null){
    items = [];
  }else{
    items = JSON.parse(localStorage.getItem('tweetList'));
  }
  return items;
}

//Save data to local storage
function saveTweetDataToLocalStore(data){
  localStorage.setItem('tweetList', JSON.stringify(totalTweetData));
}


//Count the tweet words
tweetInput.addEventListener('keyup', () => {
  // wordaCount++;
  const wordCounter = tweetInput.value.length;
  wordCountEl.innerHTML = wordCounter;

  //make the color red after 250 charecter
  if(wordCounter >= 250){
    console.log('Red');
    document.querySelector('.wordCountDiv').classList.add('alert-danger');
    tweetBtn.setAttribute('disabled', 'disabled');
  }else{
    document.querySelector('.wordCountDiv').classList.remove('alert-danger');
    tweetBtn.removeAttribute('disabled');
  }
});

//Create tweet
function makeTweet(){
  const tweetText = tweetInput.value;
  const date = new Date();
  // const [month, day, year]  = [date.getMonth(), date.getDate(), date.getFullYear()];
  const timeYear = date.getFullYear();
  const timeMonth = date.getMonth();
  const timeDay = date.getDay();
  const timeHour = date.getHours();
  const timeMinute = date.getMinutes();
  let tweetId = 0;

  if(totalTweetData.length === 0){
    tweetId = 0;
  }else{
    tweetId = totalTweetData[totalTweetData.length - 1].id;
    tweetId++;
  }
  

  if(tweetText == ''){
    alert('Please fillup the form');
  }else{
    totalTweetData.push({tweet: tweetText, id: tweetId, time: date, year: timeYear, month: timeMonth, day: timeDay, min: timeMinute, hour: timeHour});
  
    //Show Data to UI
    tweetsList.innerHTML = '';
    showDataToUI();
  
    //Clear Input
    tweetInput.value = '';

    //Save Data To Local Store
    saveTweetDataToLocalStore();
  }
}

//Show Tweet Data
function showDataToUI(){
  totalTweetData.forEach((eachTweet) => {
    let tweet = document.createElement('div');
    tweet.className = 'tweet-1 tweet-collection';
    tweet.id = `tweet-${eachTweet.id}`;
    tweet.innerHTML = `
      <div class="tweet-img">
        <img src="assets/images/img_avatar.png" alt="Avatar">
      </div>
      <div class="tweet-txt">
        <div class="tweet-name-date">
          <strong> Zayed Samad</strong>
          <span class="twitter-account"> @zayed</span> -
          <span class="date">${eachTweet.year}-${eachTweet.month}-${eachTweet.day} <i>${eachTweet.hour}:${eachTweet.min}</i>
          </span>
        </div>
        <div class="message">
          ${eachTweet.tweet}
        </div>
        <div class="tweet-icons">
        <span><i class="fas fa-heart"></i></span>
        <span class="edit"><i class="fas fa-edit editTweet"></i></span>
        <span class="delete"><i class="fas fa-trash deleteTweet"></i></span>
        </div>
      </div>
    `;
    tweetsList.appendChild(tweet);
  });
  
}

showDataToUI();


//Search Data 
function searchTweet(e){
  e.preventDefault();
  const searchText = e.target.value.toLowerCase();
  
  document.querySelectorAll('.tweet-collection').forEach((tweet) => {
    const textTweet = tweet.children[1].children[1].textContent.toLowerCase();
    if(textTweet.indexOf(searchText) === -1){
      tweet.style.display = 'none';
    }else{
      tweet.style.display = 'block';
    }
  })
}

function deleteFromLocalStore(id){
  const items = JSON.parse(localStorage.getItem('tweetList'));
  let result = items.filter(item => {
    return item.id !== id;
  });
  localStorage.setItem('tweetList', JSON.stringify(result));
  // console.log(result);
}

// Delete & Update Item
tweetsList.addEventListener('click', e => {
  const id = parseInt(e.target.parentElement.parentElement.parentElement.parentElement.id.split('-')[1]);
  if(e.target.classList.contains('deleteTweet')){
    e.target.parentElement.parentElement.parentElement.parentElement.remove();

    //Remove From Local
    deleteFromLocalStore(id);
  }else if(e.target.classList.contains('editTweet')){
    // console.log('You Want To Edit?' + id);
    //Find Tweet By ID
    const findTweet = findTweetByID(id);
    console.log(findTweet);
    //Pull Data To UI
    pullDataToUI(findTweet);
    //Update The Tweet After Modify
    updateTheTweet(findTweet.id);
  }
});

//Find The Targeted Tweet By The #ID
function findTweetByID(id){
  const foundTweet = totalTweetData.find((tweet) => tweet.id === id);
  if(!foundTweet){
    alert("Nothing Found");
    return;
  }
  return foundTweet;
}

//Pull data to UI
function pullDataToUI(findTweet){
  tweetInput.value = findTweet.tweet;
  tweetBtn.style.display = 'none';
  const UpdateBTN = `<button type="button" id="tweetUpdate" class="btn btn-primary btn-sm tweeterBtn">Update</button>`;
  document.querySelector('.second-post-icons').insertAdjacentHTML('beforeend', UpdateBTN);
}

//Update The Tweet
function updateTheTweet(id){
  document.getElementById('tweetUpdate').addEventListener('click', (e) => {
    e.preventDefault();
    // console.log(tweetInput.value, id);

    let TweetItem = totalTweetData.map((tweet) => {
      if(tweet.id === id){
        return{
          ...tweet,
          tweet: tweetInput.value,

        }
      }else{
        return tweet;
      }
    });
    console.log(TweetItem);
    localStorage.setItem('tweetList', JSON.stringify(TweetItem));
    tweetsList.innerHTML = '';
    showDataToUI();
    document.location.reload();

  });
}


