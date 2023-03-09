let radius;

/*
function displayTime(){
    var dateTime = new Date();
    var hrs = dateTime.getHours();
    var min = dateTime.getMinutes();
    var sec = dateTime.getSeconds();
    var session = document.getElementById('session');

    if(hrs >= 12){
        session.innerHTML = 'בערב';
    }else{
        session.innerHTML = 'בבוקר';
    }

    if(hrs > 12){
        hrs = hrs - 12;
    }

    document.getElementById('hours').innerHTML = hrs;
    document.getElementById('minutes').innerHTML = min;
    document.getElementById('seconds').innerHTML = sec;
}
setInterval(displayTime, 10);
*/
function loadGoogleMapsScript(callback) {
  const script = document.createElement("script");
  script.defer = true;
  script.type = "text/javascript";
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDT6PD_dlie0kMexdyaUcLCAbAq_Pi6oQ0&libraries=places&callback=" + callback;
  document.head.appendChild(script);
}


/* ____________________________________ NAV BAR_______________________________*/

const activePage = window.location.pathname;
const activeLink = document.querySelectorAll('nav ul li a').forEach(link => {
  console.log('navBar מופעל');
  if (link.href.includes(`${activePage}`)) {
    link.classList.add("active-link");
  }
});
// console.log(activeView);

/* ___________________VALIDATION Registration Form_____________________ */ 

// פונקציית הרשמה
function setupRegistrationForm() {
  console.log('נכנס לולידציה על הרשמה');
  const form = document.querySelector('#regiForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const emailInput = document.querySelector('#regemail');
    const nameInput = document.querySelector('#regname, #updatename');
    const lastnameInput = document.querySelector('#reglastname, #updatelastname');
    const telInput = document.querySelector('#regte');
    const passwordInput = document.querySelector('#loginPassword, #updatePassword');
    const password2Input = document.querySelector('#loginPassword2, #updatePassword2');
    const picInput = document.querySelector('#regpic, #updatepic');
    const googleCInput = document.querySelector('#GoogleC, #updateGoogleC');

    // Validation email
    const emailValue = emailInput.value.trim();
    if (emailValue === '') {
      displayErrorMessage(emailInput, 'לא הוזן מייל');
      return;
    } else if (!isValidEmail(emailValue)) {
      displayErrorMessage(emailInput, 'הוכנס מייל לא תקין, שמור על פורמט x@x.x');
      return;
    }

    // Validation name
    const nameValue = nameInput.value.trim();
    const UsernameToString = nameValue.toString();
    if (UsernameToString.length < 2) {
      displayErrorMessage(nameInput, 'הכנס לפחות 2 אותיות בשם');
      return;
    } else if (!isValidname(nameValue)) {
      displayErrorMessage(nameInput, 'השם כולל תווים לא חוקיים');
      return;
    }

    // Validation last name
    const lastnameValue = lastnameInput.value.trim();
    const UserLastnameToString = lastnameInput.toString();
    if (UserLastnameToString .length < 2) {
      displayErrorMessage(lastnameInput, 'הכנס לפחות 2 אותיות בשם משפחה');
      return;
    } else if (!isValidname(lastnameValue)) {
      displayErrorMessage(lastnameInput, 'השם משפחה כולל תווים לא חוקיים');
      return;
    }

    // Validation phone number
    const telValue = telInput.value.trim();
    if (telValue === '') {
      displayErrorMessage(telInput, 'לא הוזן מספר');
      return;
    } else if (!isValidTel(telValue)) {
      displayErrorMessage(telInput, 'הוזן מספר לא חוקי');
      return;
    }

    // Validation password
    const passwordValue = passwordInput.value.trim();
    const password2Value = password2Input.value.trim();
    if (passwordValue === '') {
      displayErrorMessage(passwordInput, 'לא הוזנה סיסמא');
      return;
    } else if (passwordValue !== password2Value) {
      displayErrorMessage(password2Input, 'הסיסמאות אינן תואמות');
      return;
    }else if (!isValidPassword(passwordValue)) {
      displayErrorMessage(passwordInput, 'הוזנה סיסמא לא חוקית');
      return;
    }  

    // Validation profile picture
    const picValue = picInput.value.trim();
    if (picValue !== '' && !isValidPic(picValue)) {
      displayErrorMessage(picInput, 'הוכנס פורמט לא חוקי של תמונה');
      return;
    }

    // Validation Google calendar URL
    const googleCValue = googleCInput.value.trim();
    if (googleCValue !== '' && !isValidGoogleC(googleCValue)) {
      displayErrorMessage(googleCInput, 'הכנס בבקשה URL חוקי של לוח שה של גוגל');
      return;
    }
    form.submit();
  });

  function displayErrorMessage(input, message) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    errorMessage.innerText = message;
    formGroup.classList.add('has-error');
    
    // Add an event listener to the input to clear the error message if it becomes valid
    input.addEventListener('input', () => {
      if (input.validity.valid) {
        errorMessage.innerText = '';
        formGroup.classList.remove('has-error');
      }
    });
    window.scrollTo(0, 0);
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidTel(tel) {
    const telRegex = /^05\d([-]{0,1})\d{7}$/;
    return telRegex.test(tel);
  }

  function isValidname(name) {
    const nameRegex = /^[א-תA-Za-z ]{2,30}$/;
    return nameRegex.test(name);
  }

  function isValidPassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  }

  function isValidGoogleC(url) {
    // validate Google calendar URL format
    const urlRegex = /https:\/\/calendar\.google\.com\/calendar\/embed\?.*src=.+/;
    return urlRegex.test(url);
  }

  function isValidPic(pic) {
    // Checks if the file is PNG
    const extension = pic.split('.').pop();
    return extension === ('png'|| 'PNG');
  }
}

// האזנה לעמוד ההרשמה
window.addEventListener('load', () => {
  if (document.querySelector('#regiForm')) {
    console.log('עשה לווד לחלון שמאפשר ולידציה על הרשמה');
    // loadGoogleMapsScript('setupRegistrationForm');
    setupRegistrationForm();
  } 
}); 

window.addEventListener('load', () => {
  if (document.querySelector('#updateForm')) {
    // insertcookieTORegUpdate();
    // loadGoogleMapsScript('setupRegistrationForm');
    setupRegistrationForm();
  } 
}); 

/* ___________________________________________________________ HOME PAGE _____________________________________________________________ */ 
/* __________________________ NAV - SEARCH _____________________ */ 

// פונקציית שורת חיפוש
function setupSearchBar() {
  console.log('פונקציית שורת חיפוש');
  $('#searchbox').on('input', function() {
    const query = $(this).val();
    if (query.length > 0) {
      $.ajax({
        url: '/api/posts/search',
        data: { searchbox: query },
        success: function(results) {
          const suggestions = results.map((result) => {
            return `<li><a href="/post/${result.post_id}">${result.PostTitle}</a></li>`;
          }).join('');
          console.log(suggestions)
          console.log($('#searchbox-suggestions'));
          $('#searchbox-suggestions').html(suggestions).show();
        }
      });
    } else {
      $('#searchbox-suggestions').empty().hide();
    }

    // hide suggestions when clicking outside of the input and suggestions list
    $(document).on('click', function(e) {
      if (!$(e.target).closest('#searchbox, #searchbox-suggestions').length) {
        $('#searchbox-suggestions').empty().hide();
      }
    });
    const searchBox = document.querySelector('#searchbox');
    
    document.querySelector('#searchboxButton').addEventListener('click', function(event) {
      event.preventDefault();
      const query = searchBox.value.trim();
    
      if (query.length === 0) {
        displayErrorMessage(searchBox, 'לא ניתן לבצע חיפוש ריק');
      }
    });

  });

  function displayErrorMessage(input, message) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    errorMessage.innerText = message;
    formGroup.classList.add('has-error');
  }
  
  
}

// פונקציית הכנסת תמונת פרופיל לשורת הניווט
function userprofilepic() {
  //user picture
  const ProfilePic = document.querySelector("#myprofile");
  const userPhone = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('UserPhone='))
    ?.split('=')[1];

  const imageUrl = userPhone ? `/images/UsePic/${userPhone}.png` : `/images/UsePic/default.png`;
  ProfilePic.src = imageUrl;
}

// האזנה לשורת חיפוש 
window.addEventListener('load', () => {
  if (document.querySelector('#searchbox')) {
    console.log('עשה לווד לעמוד עם שורת חיפוש');
    setupSearchBar();
    userprofilepic();
  }
});

/* ____ GOOGLE map for Registration = most came with the maps from google ______ */

// פונקציות הקשורות למפת גוגל וכן פונקציה הדואגרת לערכי המיקום של המשתמש בעת הרישום
function initAutocomplete() {
  console.log('מאתחל גוגל');

  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 31.2593613, lng: 34.7854609 },
    zoom: 10,
    mapTypeId: "roadmap", 
    disableDefaultUI: true,
  });

  const input = document.getElementById("pacinput");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }
    
    const firstPlace1 = places[0]; 
    console.log(firstPlace1);
    const firstPlace = places[0].formatted_address; 
    console.log(firstPlace);

    const lat = firstPlace1.geometry.location.lat();
    console.log(lat);

    const lng = firstPlace1.geometry.location.lng();
    console.log(lng);

    document.getElementById("UAdress").value = firstPlace;
    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = lng;

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      if (place.geometry.viewport) {

        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

window.initAutocomplete = initAutocomplete;

/* ____________ֹֹֹ______ RANGE KM \ money ________________________ */

//פונקצייה לסליידרים של סינון לפי מיקום ומחיר
function setUpSliders() {
  console.log('פונקציית סליידרים');
  let slider = document.getElementById("myRange");
  let slider2 = document.getElementById("myRange2");
  let output = document.getElementById("demo");
  let output2 = document.getElementById("demo2");

  output.innerHTML = slider.value;
  output2.innerHTML = slider2.value;

  slider.oninput = function() {
    output.innerHTML = this.value;
  }

  slider2.oninput = function() {
    output2.innerHTML = this.value;
  }
}

/*
window.addEventListener('load', () => {
  if (document.querySelector('#citySearch')) {
    console.log('עשה לווד להתחיל סליידרים וגוגל');
    setUpSliders();
  }
});*/

/* __________________  Filter(small) Location ____________  */

// פונקציה הדואגת לערך הדיפולטי של מיקום המשתמש וכמו כן מעדכנת את ערכי נקודות המיקום
function autocompleteCity() {
  console.log('פונקציית פילטר עיר');
  const input = document.getElementById("citySearch");
  const autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: "il" },fields: ["address_components", "geometry", "name"],
  });
  
  //בעזרת זה נקודת הציון של הערך הדיפולטי גם נשמרות
  const defaultAddress = input.value;
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: defaultAddress }, (results, status) => {
    if (status === "OK") {
      const place = results[0];
      autocomplete.setFields(["address_components", "geometry"]);
      autocomplete.setBounds(place.geometry.viewport);
      autocomplete.set('place', place);
    }
  });

  autocomplete.addListener("place_changed", function () {
    place = autocomplete.getPlace();
    if (place.geometry) {
      cityLat = place.geometry.location.lat();
      console.log('lat'+cityLat);
      cityLng = place.geometry.location.lng();
      console.log('lng'+cityLng);

      //מכניס את הערכים למשתנים בלתי נראים עם אותו שם הנשלחים בפורם בפאג
      document.getElementById("cityLat").value = cityLat;
      document.getElementById("cityLng").value = cityLng;

      const slider = document.getElementById("myRange");
      radius = slider.value;
      
    }
  })
}
//
window.addEventListener('click', () => {
  if (document.querySelector('#showContent')) {
    console.log('עכשיו אמור להיות מופעל גוגל ');
    //loadGoogleMapsScript('autocompleteCity');
    autocompleteCity();
  }
});

/* _________________________  Bubbles _______________________ */

//(נקראת ע"י פונקציית החיפוש) פונקציית האזנה ותזוזת הבועות
function setupBubbleMove() {
  console.log('פונקציית תזוזת בובות');
  const meRoshBubble = document.querySelector("#meRosh");
  const forNowBubble = document.querySelector("#forNow");
  const kosherBubble = document.querySelector("#Kosher");
  const notKosherBubble = document.querySelector("#notKosher");
  const healthyBubble = document.querySelector("#healthy");
  const mushhatBubble = document.querySelector("#mushhat");
  const sweetyBubble = document.querySelector("#sweety");
  const saltyBubble = document.querySelector("#salty");
  const milkBubble = document.querySelector("#milk");
  const meatBubble = document.querySelector("#meat");
  const fishBubble = document.querySelector("#fish");
  const parveBubble = document.querySelector("#parve");
  const ExtraFillter = document.querySelector(".contentItem.Filter");
  const searchBTN = document.querySelector("#searchBTN");

  const h3Bub1 = document.querySelector("#h3Bub1");
  const h3Bub2 = document.querySelector("#h3Bub2");
  const h3Bub3 = document.querySelector("#h3Bub3");
  const h3Bub4 = document.querySelector("#h3Bub4");
  const h3Bub5 = document.querySelector("#h3Bub5");

  clickedBubbles  = []; // array to store clicked bubble ids

  const bubbleItems = document.querySelectorAll('.bubbleItem');
  const contentItems = document.querySelectorAll('.contentItem');
  const showContentButton = document.querySelector("#showContent");
  
  showContentButton.addEventListener("click", () => {
    h3Bub1.style.visibility = "visible";
    meRoshBubble.style.visibility = "visible";
    forNowBubble.style.visibility = "visible";
    ExtraFillter.style.visibility = "visible";
    searchBTN.style.visibility = "visible";
    
    scrollBy({top: 350, behavior: `smooth`});
  })
  

  document.querySelectorAll("#meRosh, #forNow").forEach((bubble) => {
    bubble.addEventListener("click", () => {
      const bubbleId = bubble.value;
      if(!clickedBubbles.includes(bubbleId)){
        clickedBubbles.push(bubbleId);
      }
      console.log(clickedBubbles);
      if(bubbleId==="meRosh") forNowBubble.style.visibility = "hidden"
       else meRoshBubble.style.visibility = "hidden";
      h3Bub2.style.visibility = "visible";
      kosherBubble.style.visibility = "visible";
      notKosherBubble.style.visibility = "visible";
      scrollBy({top: 350, behavior: `smooth`});
    })
  }),

  document.querySelectorAll("#Kosher, #notKosher").forEach((bubble) => {
    bubble.addEventListener("click", () => {
      const bubbleId = bubble.value;
      if(!clickedBubbles.includes(bubbleId)){
        clickedBubbles.push(bubbleId);
      }
      console.log(clickedBubbles);
      if(bubbleId==="Kosher") notKosherBubble.style.visibility = "hidden"
       else kosherBubble.style.visibility = "hidden";
      h3Bub3.style.visibility = "visible";
      healthyBubble.style.visibility = "visible";
      mushhatBubble.style.visibility = "visible";
      scrollBy({top: 350, behavior: `smooth`});
    })  
  }), 

  document.querySelectorAll("#healthy, #mushhat").forEach((bubble) => {
    bubble.addEventListener("click", () => {
      const bubbleId = bubble.value;
      if(!clickedBubbles.includes(bubbleId)){
        clickedBubbles.push(bubbleId);
      }
      console.log(clickedBubbles);
      console.log(clickedBubbles);
      if(bubbleId==="healthy") mushhatBubble.style.visibility = "hidden"
        else healthyBubble.style.visibility = "hidden";
      h3Bub4.style.visibility = "visible";
      sweetyBubble.style.visibility = "visible";
      saltyBubble.style.visibility = "visible";
      scrollBy({top: 350, behavior: `smooth`});
    }) 
  }),   

  document.querySelectorAll("#sweety, #salty").forEach((bubble) => {
    bubble.addEventListener("click", () => {
      const bubbleId = bubble.value;
      if(bubbleId==="sweety"){
        saltyBubble.style.visibility = "hidden"
        if(!clickedBubbles.includes(bubbleId)){
          clickedBubbles.push(bubbleId);
        }
        console.log(clickedBubbles);
        h3Bub5.style.visibility = "visible";
        milkBubble.style.visibility = "visible";
        parveBubble.style.visibility = "visible";
        scrollBy({top: 350, behavior: `smooth`});
      }
      else if(bubbleId==="salty"){
        sweetyBubble.style.visibility = "hidden";
        if(!clickedBubbles.includes(bubbleId)){
          clickedBubbles.push(bubbleId);
        }
        console.log(clickedBubbles);
        h3Bub5.style.visibility = "visible";
        milkBubble.style.visibility = "visible";
        meatBubble.style.visibility = "visible";
        fishBubble.style.visibility = "visible";
        parveBubble.style.visibility = "visible";
        scrollBy({top: 350, behavior: `smooth`});
      }
    })
  }),
  
  document.querySelectorAll("#milk, #meat, #fish, #parve" ).forEach((bubble) => {
    bubble.addEventListener("click", (event) => {
      const bubbleId = event.target.value;
      if(!clickedBubbles.includes(bubbleId)){
        clickedBubbles.push(bubbleId);
      }
      console.log(clickedBubbles);
      if(bubbleId==="milk"){
        meatBubble.style.visibility = "hidden";
        fishBubble.style.visibility = "hidden";
        parveBubble.style.visibility = "hidden";
      }else if(bubbleId==="meat"){
        milkBubble.style.visibility = "hidden";
        fishBubble.style.visibility = "hidden";
        parveBubble.style.visibility = "hidden";
      }else if(bubbleId==="fish"){
        meatBubble.style.visibility = "hidden";
        milkBubble.style.visibility = "hidden";
        parveBubble.style.visibility = "hidden";
      }else if(bubbleId==="parve"){
        meatBubble.style.visibility = "hidden";
        milkBubble.style.visibility = "hidden";
        fishBubble.style.visibility = "hidden";
      }
    })
  });
  return(clickedBubbles);
};

//  (נקראת ע"י פונקציית החיפוש) פונקציית איחוד תגיות בתוך הבועות לאחד
function getSelectedTags(bubbleItems) {
  console.log('פונקציית איחוד תגיות בתוך הבועות לאחד');
  const tagCheckboxes = document.querySelectorAll('input[name="hashtag"]:checked');
  console.log(tagCheckboxes);
  console.log(bubbleItems);

  tagCheckboxes.forEach((checkbox) => {
    const checkboxValue = checkbox.value;
    if(!bubbleItems.includes(checkboxValue)){
      bubbleItems.push(checkboxValue);
    }
    console.log(bubbleItems);
    return(bubbleItems);
  });  
};

/* ___________________  Bubbles & TAGS combined _____________ */

// פונקציית החיפוש הדואגת לאיחוד התגיות בעת לחיצה על->חפש
function submitSearchForm() {
  setupBubbleMove();
  console.log(clickedBubbles);

  const searchButton  = document.querySelector("#searchBTN");
  searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    console.log(clickedBubbles);
    getSelectedTags(clickedBubbles);
    const tagsForPosts = clickedBubbles;
    console.log(tagsForPosts);

    handleSearchFormSubmit(tagsForPosts);
    
  });
}

//פונקצייה המאחדת את כל המסננים ושולחת לשרת וגם מעבירה לתוצאות החיפוש 
async function handleSearchFormSubmit(tagsForPosts) {
  const cityLat = document.getElementById("cityLat").value;
  const cityLng = document.getElementById("cityLng").value;
  const radius = document.getElementById("myRange").value;
  const maxPrice = document.getElementById('myRange2').value;
  const availability = $('#availableWeek').prop('checked');

  const data = { tags: tagsForPosts, 
                  location: { cityLat, cityLng, radius }, 
                  maxPrice: maxPrice, 
                  availability: availability
  };

  const encodedJson = encodeURIComponent(JSON.stringify(data));
    window.location.href = `/AfterSearch?data=${encodedJson}`;
}
 
//האזנה לעמוד הבית
window.addEventListener('load', () => {
  if (document.querySelector('#showContent')) {
    console.log(" היה לווד לעמוד עם התחל");
    loadGoogleMapsScript("setUpSliders");
    submitSearchForm();
  }
});

// ||'#searchAgain'

/* __________________  After Search ____________  */

//להבא
window.addEventListener('load', () => {
  if (document.querySelector('#searchAgain')) {
    const ExtraFillter = document.querySelector(".contentItem.Filter");
    ExtraFillter.style.visibility = "visible";
    //loadGoogleMapsScript();
    setUpSliders();

  }
});

window.addEventListener('click', () => {
  if (document.querySelector('#searchAgain')) {
    //loadGoogleMapsScript('autocompleteCity');
    autocompleteCity();
  }
});


//מכיוון שלא ניתן למחוק את העוגיות השומרות את המרחק במטרה להציג אותו בשלב הפוסט יש צורך לעבוד קשה  על מנת שיראה את הערך האחרון של מספר פוסט ולא הראשון

/*
function getLastDistances() {
  const cookie = document.cookie;
  if (!cookie) {
    return {};
  }
  const cookieArr = cookie.split(';');
  for (let i = cookieArr.length - 1; i >= 0; i--) {
    let cookiePair = cookieArr[i].split('=');
    if (cookiePair[0].trim() === 'distances') {
      var cookieValue = decodeURIComponent(cookiePair[1].trim());
      return JSON.parse(cookieValue);
    }
  }
  return {};
}

function updatePostDistances() {
  const distances = getLastDistances();
  const postDistances = document.querySelectorAll('[data-post-id]');
  postDistances.forEach(function(postDistance) {
    const post_id = postDistance.dataset.post_id;
    const lastDistance = distances[post_id];
    if (lastDistance) {
      postDistance.textContent = parseFloat(lastDistance.distance).toFixed(2) + ' ק"מ';
    }
  });
}

updatePostDistances();*/

//אופציה ב' שמירה על מערך של רק הפוסטים האחרונים אשר ימחקו בכל שלב שהוא לא- כניסה לתוך מאכל
/*
function getLastDistances() {
  const cookie = document.cookie;
  const distances = {};
  if (cookie) {
    const cookieArr = cookie.split(';');
    for (let i = cookieArr.length - 1; i >= 0; i--) {
      let cookiePair = cookieArr[i].split('=');
      if (cookiePair[0].trim() === 'distances') {
        const cookieValue = decodeURIComponent(cookiePair[1].trim());
        distances = JSON.parse(cookieValue);
        break;
      }
    }
  }
  return distances;
}

function updatePostDistances() {
  const distances = getLastDistances();
  const postDistances = document.querySelectorAll('[data-post-id]');
  postDistances.forEach(function(postDistance) {
    const postID = postDistance.dataset.postId;
    const lastDistance = distances[postID];
    if (lastDistance) {
      postDistance.textContent = parseFloat(lastDistance.distance).toFixed(2) + ' ק"מ';
    }
  });
}

updatePostDistances();*/




/* ___________  Location of a new Post --> default their home(but dosn't have to be!) _______________________________  */

// ולידציה של יצירת פוסט חדש
function setupNewPostForm() {
  console.log('נכנס לולידציה על פוסט חדש');
  const form = document.querySelector('#formToPost');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const PostTitle = document.querySelector('#PostTitle');
    const PostDescrip = document.querySelector('#PostDescrip');
    const PostFoodPic = document.querySelector('#PostFoodPic');
    const PostPrice = document.querySelector('#PostPrice');
    const IsDeliver = document.querySelector('#IsDeliver');
    const PreOrderTime = document.querySelector('#PreOrderTime');
    const DeliverFee = document.querySelector('#DeliverFee');
    const MaxDayAmount = document.querySelector('#MaxDayAmount');
    const NewforNowBox = document.querySelector('#MaxDayAmount');

    if (PreOrderTime.value === '0') {
      NewforNowBoxCheckbox.checked = true;
    }
    
    // Validation PostTitle
    const PostTitleValue = PostTitle.value.trim();
    const PostTitleToString = PostTitleValue.toString();
    if (PostTitleToString.length < 2) {
      displayErrorMessage(nameInput, 'הכנס לפחות 2 אותיות בכותרת');
      return;
    } else if (!isValidname(PostTitleValue)) {
      displayErrorMessage(PostTitle, 'הכותרת כוללת תווים לא חוקיים');
      return;
    }

    // Validation PostDescrip
    const PostDescripValue = PostDescrip.value.trim();
    const UPostDescripToString = PostDescripValue.toString();
    if (UPostDescripToString .length < 2) {
      displayErrorMessage(PostDescrip, 'הכנס לפחות 2 אותיות בהסבר ');
      return;
    } else if (!isValidname(PostDescripValue)) {
      displayErrorMessage(PostDescrip, 'ההסבר כולל תווים לא חוקיים');
      return;
    }

    // Validation post picture
    const PostFoodPicValue = PostFoodPic.value.trim();
    if (PostFoodPicValue !== '' && !isValidPic(PostFoodPicValue)) {
      displayErrorMessage(PostFoodPic, 'הוכנס פורמט לא חוקי של תמונה');
      return;
    }
    // Validation of numbers
    const PostPriceValue = Number(PostPrice.value.trim());
    const PreOrderTimeValue = Number(PreOrderTime.value.trim());
    const DeliverFeeValue = Number(DeliverFee.value.trim());
    const MaxDayAmountValue = Number(MaxDayAmount.value.trim());

    if (isNaN(PostPriceValue) || PostPriceValue <= 0 || PostPriceValue > 9999) {
      displayErrorMessage(PostPrice, 'המחיר חייב להיות מספר בין 0 ל-9999');
      return false;
    }
    if (isNaN(PreOrderTimeValue) || PreOrderTimeValue <= 0 || PreOrderTimeValue > 9999) {
      displayErrorMessage(PreOrderTime, 'זמן הזמנה קדימה חייב להיות מספר בין 0 ל-9999');
      return false;
    }
    
    if (IsDeliver.checked && (isNaN(DeliverFeeValue) || DeliverFeeValue <= 0 || DeliverFeeValue > 9999)) {
      displayErrorMessage(DeliverFee, 'עלות משלוח חייבת להיות מספר בין 0 ל- 9999');
      return false;
    }
    
    if (isNaN(MaxDayAmountValue) || MaxDayAmountValue <= 0 || MaxDayAmountValue > 9999) {
      displayErrorMessage(MaxDayAmount, 'כמות מרבית ליום חייבת להיות מספר חיובי בין 1 ל-9999');
      return false;
    }
    return true;
    
  });

  function displayErrorMessage(input, message) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    errorMessage.innerText = message;
    formGroup.classList.add('has-error');
    
    input.addEventListener('input', () => {
      if (input.validity.valid) {
        errorMessage.innerText = '';
        formGroup.classList.remove('has-error');
      }
    });
    window.scrollTo(0, 0);
  }

  function isValidname(name) {
    const nameRegex = /^[א-תA-Za-z ]{2,30}$/;
    return nameRegex.test(name);
  }

  function isValidPic(pic) {
    // Checks if the file is PNG
    const extension = pic.split('.').pop();
    return extension === ('png' || 'PNG');
  }
}

//פונקצייה השומרת את ערכי המיקום של הפוסט
async function autocompleteAddressNew() {
  console.log("פונקציית כתובת לפוסט חדש");
  const input = document.getElementById("PostAddress");
  const autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: "il" },fields: ["address_components", "geometry", "name"],
  });

  const defaultAddress = input.value;
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: defaultAddress }, (results, status) => {
    if (status === "OK") {
      const place = results[0];
      autocomplete.setFields(["address_components", "geometry"]);
      autocomplete.setBounds(place.geometry.viewport);
      autocomplete.set('place', place);
    }
  });

  autocomplete.addListener("place_changed", function () {
    place = autocomplete.getPlace();
    if (place.geometry) {
      PostAddressLat = place.geometry.location.lat();
      console.log('latBeforeSent'+PostAddressLat);
      PostAddressLng = place.geometry.location.lng();
      console.log('lngBeforeSent'+PostAddressLng);
      
      //מכניס את הערכים למשתנים בלתי נראים עם אותו שם הנשלחים בפורם בפאג
      document.getElementById("PostAddressLat").value = PostAddressLat;
      document.getElementById("PostAddressLng").value = PostAddressLng;
    }
  })
}

window.addEventListener('load', () => {
  if (document.querySelector('#formToPost')) {
    console.log("היה לווד לעמוד לפוסט חדש");
    //loadGoogleMapsScript('autocompleteAddressNew');
    autocompleteAddressNew();
    setupNewPostForm();

  

    // const SendPost = document.getElementById("newPostButton")
    const Postform = document.getElementById("formToPost");
    Postform.addEventListener('submit', (event) => {
      event.preventDefault();
      console.log('lngAfterSent'+document.getElementById("PostAddressLat").value)
      const Postformm = document.getElementById("formToPost");
      Postformm.submit();
    });
    
  } 
});