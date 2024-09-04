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
    if (attempts === 6) return gameOver();
    attempts += 1;
    index = 0;
  };

  const gameOver = () => {
    window.removeEventListener("keydown", handleKeyDown);
    displayGameOver();
    clearInterval(timer);
  };

  const handleEnterKey = async () => {
    // 엔터누르면
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
      // 데이터 키가 입력받은 글자랑 같은 곳을 영역으로 지정
      const keyElement = document.querySelector(
        `.key[data-key='${입력한_글자}']`
      );
      const 정답_글자 = 정답[i];
      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        block.style.background = "#6AAA64";
        if (keyElement) keyElement.style.background = "#6AAA64";
      } else if (정답.includes(입력한_글자)) {
        block.style.background = "#c9b458";
        if (keyElement && keyElement.style.background !== "#6AAA64") {
          // 키가 이미 초록색이 아니라면 노란색으로 변경
          keyElement.style.background = "#c9b458";
        }
      } else {
        block.style.background = "#787c7e";
      }
      block.style.color = "white";
    }

    if (맞은_갯수 === 5) gameOver();
    else nextLine();
  };

  const handleBackspace = () => {
    if (index > 0) {
      // 만약 목록이 0보다 크면 첫번째 박스가  아니면
      const preBlock = document.querySelector(
        //이전 박스로 이동
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = ""; // 그리고 현 위치의 값은 초기화한다.
    }
    if (index !== 0) index -= 1; // 만약 목록이 0이 아니면 하나 뺀다.
  };

  const handleKeyDown = (event) => {
    // 키가 눌렸을 때 이벤트
    const key = event.key.toUpperCase(); // 해당 키가 눌렸을 때 키의 값을 대문자로 바꿔서 담는다.
    const keyCode = event.keyCode; // 해당 키의 키코드 값을 받는다.
    const thisBlock = document.querySelector(
      // 해당 영역을 지정한다.
      `.board-block[data-index='${attempts}${index}']` // 보드블럭이라는 클레스인데 데이터 인덱스 값이 시도값과 목록값인걸로.
    );

    if (event.key === "Backspace")
      handleBackspace(); // 만약 키의 값이 Backspace면 해당 함수 발동
    else if (index === 5) {
      //  백스페이스 말고 또는 인덱스가 5면
      if (event.key === "Enter") handleEnterKey(); // 엔터키일때 엔터함수
      else return; // 그게 아니라면 아무것도 리턴하지 않는다.
    } else if (65 <= keyCode && keyCode <= 90) {
      // 인덱스가 5가 아니라면 키코드가 65~90 즉 a~z까지의 값만
      thisBlock.innerText = key; // 해당 영역에 그 키 값을 넣고
      index = index + 1; // 인덱스를 1 올린다.
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
  window.addEventListener("keydown", handleKeyDown); // 모든 키보드를 누를 때 작동하는 함수이벤트를 만든다.

  /// 클릭했을 때 작동하는 것들
  const keys = document.querySelectorAll(".key"); // 모든 key라는 클래스를 가진 영역을 배열의 형태로 keys에 담는다.
  keys.forEach((key) => {
    //각 영역을 key라고 정의하고 그 키마다 이벤트를 만든다.
    key.addEventListener("click", () => {
      // 클릭을 하면
      // 클릭된 요소의 data-key 값을 가져옴
      const keyValue = key.getAttribute("data-key");
      // 해당 영역의 속성중 데이터키의 값을 키벨류 값에 받아서
      const keyCodeValue = parseInt(key.getAttribute("data-keycode"));
      // 키코드 값도 받아서
      const eventkey = new KeyboardEvent("keydown", {
        key: keyValue,
        keyCode: keyCodeValue,
        which: keyCodeValue,
      });
      window.addEventListener("keydown", handleKeyDown(eventkey));
    });
  });
  // 백스페이스랑 엔터도 따로
  // const enterKey = document.querySelector(".key-enter");
  // enterKey.addEventListener("click", () => {
  //   // 클릭을 하면
  //   // 클릭된 요소의 data-key 값을 가져옴
  //   const keyValue = enterKey.getAttribute("data-key");
  //   // 해당 영역의 속성중 데이터키의 값을 키벨류 값에 받아서
  //   const keyCodeValue = parseInt(enterKey.getAttribute("data-keycode"));
  //   // 키코드 값도 받아서
  //   const eventkey = new KeyboardEvent("keydown", {
  //     key: keyValue,
  //     keyCode: keyCodeValue,
  //     which: keyCodeValue,
  //   });
  //   window.addEventListener("keydown", handleKeyDown(eventkey));
  // });
  // const backspaceKey = document.querySelector(".key-backspace");
  // backspaceKey.addEventListener("click", () => {
  //   // 클릭을 하면
  //   // 클릭된 요소의 data-key 값을 가져옴
  //   const keyValue = backspaceKey.getAttribute("data-key");
  //   // 해당 영역의 속성중 데이터키의 값을 키벨류 값에 받아서
  //   const keyCodeValue = parseInt(backspaceKey.getAttribute("data-keycode"));
  //   // 키코드 값도 받아서
  //   const eventkey = new KeyboardEvent("keydown", {
  //     key: keyValue,
  //     keyCode: keyCodeValue,
  //     which: keyCodeValue,
  //   });
  //   window.addEventListener("keydown", handleKeyDown(eventkey));
  // });
}

appStart(); //시작할때 앱을 동작하는 함수
