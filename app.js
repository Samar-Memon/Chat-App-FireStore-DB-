  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
  import { getFirestore, collection,  addDoc, query, orderBy, getDocs,onSnapshot,writeBatch } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCw0FZJ9WMtJc6lruRBC_K7d1_SiJyHIBY",
    authDomain: "chat-app-firestore-db-619f1.firebaseapp.com",
    projectId: "chat-app-firestore-db-619f1",
    storageBucket: "chat-app-firestore-db-619f1.appspot.com",
    messagingSenderId: "444753819124",
    appId: "1:444753819124:web:bbdbad6e570adff9a4b5a1",
    measurementId: "G-7LRVEJ2DNF"
  };


  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  const db = getFirestore(app);

  let msgsCollection = collection(db, 'Messages');

  let msgDiv = document.querySelector('.messageArea');

  let inputBox = document.getElementById('msg');
  let sendBtn = document.getElementById('send');

  let nickeName = document.getElementById('nickName');
  let gotoChatRoom = document.getElementById('gotoChatRoom');

  gotoChatRoom.addEventListener('click', gotoChat)

  function gotoChat() {
    if(nickeName.value.trim().length > 0){
      sessionStorage.setItem('userName4Msg', nickeName.value.trim());
      document.querySelector('.setNickName').style.display = 'none'
      document.querySelector('.chatArea').style.display = 'flex'
      }else{
        alert('Value is Empty')
      }
  }


  const addMsg = (userName, msg, isSent) => {
    let createMsg = document.createElement('div');
    createMsg.className = 'message';
    createMsg.classList.add(isSent ? 'sent' : 'received');
    createMsg.innerHTML = `<strong>${userName}:</strong> <span>${msg}</span>`;
    msgDiv.appendChild(createMsg);
  };



  sendBtn.addEventListener('click', setDB)

  const fetchMessages = async () => {
    const q = query(msgsCollection, orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    msgDiv.innerHTML = ''; // Clear existing messages
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      addMsg(data.name, data.message, data.name === sessionStorage.getItem('userName4Msg'));
    });
  };


  async function setDB() {
    if (inputBox.value.trim().length > 0) {
      try {
        let messageText = inputBox.value.trim();
        let userName = sessionStorage.getItem('userName4Msg');  // Yeh static user name hai, isko dynamic banane ka sochiye
        let doc = await addDoc(msgsCollection, {
          message: messageText,
          name: userName,
          timestamp: new Date().toLocaleTimeString(),
        });
        fetchMessages()
        addMsg(doc.id,doc.data().name, doc.data().message, data.name === sessionStorage.getItem('userName4Msg'));
      } catch (e) {
        console.log("Error adding document: ", e);
        console.clear()
      }
    } else {
      alert('Please enter a message');
    }
  }

  sendBtn.addEventListener('click', () => {
    inputBox.value = ''
  })
  
  onSnapshot(msgsCollection, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      addMsg(change.doc.data().name, change.doc.data().message);
    }
  });
});


fetchMessages()


const deleteAllMessages = async () => {
  const querySnapshot = await getDocs(msgsCollection);
  const batch = writeBatch(db);

  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
};


window.onload = fetchMessages()

let get = sessionStorage.getItem('userName4Msg')

if(get){
  window.onload = document.querySelector('.setNickName').style.display = 'none'
  window.onload = document.querySelector('.chatArea').style.display = 'flex'
  document.addEventListener('keydown', (e) => {
    if(e.key == 'Enter'){
      setDB()
      msg.value = ''
    }
    msg.focus()
  })
}else{
  deleteAllMessages()
  window.onload = document.querySelector('.chatArea').style.display = 'none'
  window.onload = document.querySelector('.setNickName').style.display = 'flex'
  document.addEventListener('keydown', (e) => {
    if(e.key == 'Enter'){
      gotoChat()
    }
    nickeName.focus()
  })
}