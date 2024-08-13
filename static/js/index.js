// const 정답 = "APPLE";

let index = 0; //  목록
let attempts = 0; // 시도 수
let timer;

function appStart() {
  const displayGameOver = () => {
    const div = document.createElement("div"); // 디브태그 속성을 생성해서 변수에 담는다.
    div.innerText = "게임이 종료됐습니다."; // 변수에 담긴 태그에 텍스트를 삽입한다.
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:35vh; left:40vw; background-color:white; width:200px; height:100px;"; // 변수에 담긴 태그에 스타일 적용한다.
    document.body.appendChild(div); // 문서의 바디 태그부분에 자식을 추가한다. > 변수에 담은 태그를 바디에 삽입한다.
  };
  const nextLine = () => {
    if (attempts === 6) return gmaeOver();
    attempts += 1;
    index = 0;
  };

  const gmaeOver = () => {
    window.removeEventListener("keydown", handleKeyDown);
    displayGameOver();
    clearInterval(timer);
  };

  const handleEnterKey = async () => {
    let 맞은_갯수 = 0;

    // 서버에서 정답을 받아오는 코드
    const 응답 = await fetch("/answer");
    console.log("응답", 응답);
    // const 정답_객체 = await 응답.json();
    const 정답 = await 응답.json();
    console.log("정답", 정답);

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );
      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];
      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        block.style.background = "#6AAA64";
      } else if (정답.includes(입력한_글자)) {
        block.style.background = "#c9b458";
      } else {
        block.style.background = "#787c7e";
      }
      block.style.color = "white";
    }

    if (맞은_갯수 === 5) gmaeOver();
    else nextLine();
  };

  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  const handleKeyDown = (event) => {
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") handleBackspace();
    else if (index === 5) {
      if (event.key === "Enter") handleEnterKey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index = index + 1;
    }
  };

  const startTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, 0);
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, 0);
      const timeH1 = document.querySelector("#time");
      timeH1.innerText = `${분}:${초}`;
    }
    timer = setInterval(setTime, 1000);
  };

  startTimer();
  window.addEventListener("keydown", handleKeyDown);
}

appStart();
