import { Manager, Socket } from "socket.io-client";

let socket: Socket;

export const connectToServer = (token: string) => {
  const manager = new Manager(
    "https://nest-teslodb-production.up.railway.app/socket.io/socket.io.js",
    {
      extraHeaders: {
        authentication: token,
      },
    }
  );

  socket?.removeAllListeners();
  socket = manager.socket("/");

  addListeners();
};

const addListeners = () => {
  const serverStatusLabel =
    document.querySelector<HTMLSpanElement>("#server-status")!;
  const clientsUl = document.querySelector<HTMLUListElement>("#clients-ul")!;
  const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
  const messageInput =
    document.querySelector<HTMLInputElement>("#message-input")!;
  const messagesUl = document.querySelector<HTMLUListElement>("#messages-ul")!;

  socket.on("connect", () => {
    serverStatusLabel.innerHTML = "Connected";
  });

  socket.on("disconnect", () => {
    serverStatusLabel.innerHTML = "Disconnected";
  });

  socket.on("clients-updated", (clients: string[]) => {
    console.log({ clients });
    let clientsHtml = "";
    clients.forEach((clientId) => {
      clientsHtml += `<li>${clientId}</li>`;
    });
    clientsUl.innerHTML = clientsHtml;
  });

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (messageInput.value.trim().length <= 0) return;

    socket.emit("message-from-client", {
      id: "YO!!",
      message: messageInput.value,
    });

    messageInput.value = "";
  });

  socket.on(
    "message-from-server",
    (payload: { fullName: string; message: string }) => {
      const newMessage = `
            <li>
                <strong>${payload.fullName}</strong>
                <span>${payload.message}</span>
            </li>
      `;

      const li = document.createElement("li");
      li.innerHTML = newMessage;
      messagesUl.appendChild(li);
    }
  );
};
