const socket = io();

let form = document.getElementById("productForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData(form);
  let sendObj = {};
  data.forEach((val, key) => (sendObj[key] = val));
  socket.emit("sendProduct", sendObj);
  form.reset();
});

socket.on("productLog", (data) => {
  let productsTemplate = document.getElementById("productsTemplate");
  fetch("templates/newestProducts.handlebars")
    .then((response) => {
      return response.text();
    })
    .then((template) => {
      const processedTemplate = Handlebars.compile(template);
      let products = data.payload;
      const html = processedTemplate({ products });
      productsTemplate.innerHTML = html;
    });
});

let user = document.getElementById("user");

let chatForm = document.getElementById("chatForm");
chatForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  if (chatBox.value.trim().length > 0 && user.value.length > 0) {
    socket.emit("message", {
      user: user.value,
      message: chatBox.value,
    });
    chatBox.value = "";
  }
});

let now = new Date().toLocaleString();

//SOCKETS

socket.on("log", (dataChat) => {
  let log = document.getElementById("log");
  let messages = "";
  dataChat.forEach((message) => {
    messages =
      messages + `${message.user} ${now} dice: ${message.message}</br>`;
  });
  log.innerHTML = messages;
});
