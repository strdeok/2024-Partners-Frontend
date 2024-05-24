import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { createGlobalStyle, styled } from "styled-components";
import { FaRegCopy } from "react-icons/fa";
import Swal from "sweetalert2";

// "proxy" : "http://127.0.0.1:8000/"

const GlobalStyle = createGlobalStyle`
  html{
    height: 100%;
  }
  body{
   height: 100%;
  }
  #root {
    height: 100%;
  }

`;

const Main = styled.div`
  width: 100%;
  min-height: 100%;
  background-color: #fff2d7;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const Form = styled.form`
  input {
    border-radius: 5px;
    width: 50vw;
    &::placeholder {
      margin-left: 100px;
    }
  }
  button {
    background-color: #ffe0b5;
    padding: 3px 20px;
    border-radius: 5px;
  }
`;

const Button = styled.button`
  margin-left: 10px;
  border: none;
  &:hover {
    cursor: pointer;
  }
  &.delete_Btn {
    background-color: transparent;
    position: absolute;
    right: 0;
    top: 1%;
  }
  &.copy_Btn {
    padding-top: 5px;
  }
`;

const Gather = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 60vw;
  background-color: #f8c794;
  border-radius: 5px;
  box-shadow: 10px 7px 12px 0px rgb(194, 194, 194);
  margin: 25px 0px;
`;

const Urls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
`;

const Url_link = styled.a`
  color: #fff2d7;
  margin: 10px 0px;
  &:hover {
    color: #d8ae7e;
    transition: all 0.1s;
  }
  &:visited {
    text-decoration: none;
  }
  h4 {
    display: inline-block;
    margin-right: 5px;
  }
`;

function App() {
  const [url, setUrl] = useState("");
  const [datas, setDatas] = useState([]);

  /** 사용자 url 저장 */
  const Url = (e) => {
    setUrl(e.target.value);
  };
  /** 저장한 url 전송 */
  const postUrl = (e) => {
    e.preventDefault();
    axios
      .post("/short-links", {
        originUrl: url,
      })
      .then(function (response) {
        console.log(response);
        getAll(); // 전송과 url 데이터 동시에 가져오기
        document.querySelector("input").value = "";
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  /** url 전체 가져오기 */
  const getAll = () => {
    axios
      .get("/short-links/all")
      .then(function (response) {
        console.log(response);
        // url 데이터 새롭게 저장
        const data = response.data.map((a) => a);
        setDatas([...data]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  /** 선택한 url 지우기 */
  const deleteUrl = (id) => {
    axios
      .delete(`/short-links/delete/${id}`)
      .then((response) => {
        console.log(response);
        getAll();
      })
      .catch((error) => {
        console.log(error);
        getAll();
      });
  };

  /** 링크 복사 버튼 */
  const CopyBtn = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      Swal.fire({
        text: "Copy!",
        icon: "success",
        confirmButtonColor: "#d8ae7e",
        background: "#fff2d7",
        color: "brown",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 페이지 로드 시 url 데이터 가져오기
  useEffect(() => {
    getAll();
  }, []);

  // data 변경시 리로드
  useEffect(() => {}, [datas]);
  return (
    <>
      <GlobalStyle />
      <Main>
        <Title>Short Url 만들기</Title>
        <Form>
          <input
            type="text"
            onChange={Url}
            placeholder="url을 입력하세요"
          ></input>
          <Button className="post" onClick={postUrl}>
            생성
          </Button>
        </Form>
        {datas
          ? datas.map((a, i) => {
              return (
                <Gather key={i}>
                  <Button
                    className="delete_Btn"
                    onClick={() => {
                      deleteUrl(a.id);
                    }}
                  >
                    ❌
                  </Button>{" "}
                  <Urls>
                    <Url_link href={a.originUrl}>
                      {" "}
                      <h4>originUrl:</h4>
                      {a.originUrl}
                    </Url_link>
                    <div style={{ display: "inline" }}>
                      <Url_link href={a.shortUrl}>
                        <h4> shortUrl:</h4> {a.shortUrl}
                      </Url_link>
                      <Button
                        className="copy_Btn"
                        onClick={() => CopyBtn(a.shortUrl)}
                      >
                        <FaRegCopy />
                      </Button>
                    </div>
                  </Urls>
                </Gather>
              );
            })
          : null}
      </Main>
    </>
  );
}

export default App;
