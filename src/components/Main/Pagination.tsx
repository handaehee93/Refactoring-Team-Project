import styled from "styled-components";
import {  useState } from "react";
import { BiArrowToLeft, BiArrowToRight, BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";

export const PageNum = styled.div`
  margin: 50px 0 40px 0;
  
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  user-select: none;

  > .pageTab,
  .leftHandle,
  .rightHandle {
    width: 20px;
    height: 20px;
    background-color: transparent;
    border: none;
    font-size: 15px;
    margin: 0 5px 0 5px;
    color: ${(props) => props.theme.mainText};
    cursor: pointer;

    &:disabled {
      color: ${(props) => props.theme.disabled};
    }
  }

  > .pageFocused {
    width: 30px;
    height: 30px;
    border-radius: 3px;
    background-color: ${(props) => props.theme.mainColor};
    border: none;
    border-radius: 50px;
    color: ${(props) => props.theme.TagColor};
    font-weight: 600;
  }
`;

interface PaginationProps {
  allPageLength: number;
  LIMIT_COUNT: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  currentTab: number;
}

function Pagination( {LIMIT_COUNT,page,setPage,currentTab,allPageLength,} :PaginationProps) {
  
  const [blockNum, setBlockNum] = useState<number>(0); // 페이지 당 표시할 페이지네이션 수


  const PAGE_COUNT: number = 10; // 페이지 당 표시할 페이지네이션 수 (기본값 : 10개의 페이지네이션 노출)
  const blockArea: number = blockNum * PAGE_COUNT; // 각 페이지에서 첫 페이지네이션의 위치 계산

  const numAllPages: number = Math.ceil(allPageLength / LIMIT_COUNT); // 필요한 페이지 개수

  // 새로운 배열 생성 함수
  const createArr = (n: number) => {
    const iArr: number[] = new Array(n);
    for (let i = 0; i < n; i++) {
      iArr[i] = i + 1;
    }
    return iArr;
  };
  const allArr: number[] = createArr(numAllPages); 

  // 제일 처음 페이지로 이동하는 버튼 이벤트 핸들러
  const firstPageHandler = () => {
    setPage(1);
    setBlockNum(0);
    window.scrollTo(0, parseInt(document.body.style.top || "0", 10) * -1);
  };

  // 제일 마지막 페이지로 이동하는 버튼 이벤트 핸들러
  const lastPageHandler = () => {
    setPage(numAllPages);
    setBlockNum(Math.ceil(numAllPages / PAGE_COUNT) - 1);
    window.scrollTo(0, parseInt(document.body.style.top || "0", 10) * -1);
  };

  // 현재 페이지의 이전 페이지로 이동하는 버튼 이벤트 핸들러
  const prevPageHandler = () => {
    if (page <= 1) {
      return;
    } else if (page - 1 <= PAGE_COUNT * blockNum) {
      setBlockNum((n: number) => n - 1);
    }
    setPage((n: number) => n - 1);
    window.scrollTo(0, parseInt(document.body.style.top || "0", 10) * -1);
  };

  // 현재 페이지의 다음 페이지 이동하는 버튼 이벤트 핸들러
  const nextPageHandler = () => {
    if (page >= numAllPages) {
      return;
    } else if (PAGE_COUNT * (blockNum + 1) < page + 1) {
      setBlockNum((n: number) => n + 1);
    }
    setPage((n: number) => n + 1);
    window.scrollTo(0, parseInt(document.body.style.top || "0", 10) * -1);
  };

  return (
    <>
      <PageNum>
        <button className='leftHandle' onClick={firstPageHandler} disabled={page === 1}>
          <BiArrowToLeft size={20} />
        </button>
        <button className='leftHandle' onClick={prevPageHandler} disabled={page === 1}>
          <BiLeftArrowAlt size={19} />
        </button>
        {allArr.slice(blockArea, PAGE_COUNT + blockArea).map((n) => (
          <button
            className={page === n ? "pageTab pageFocused" : "pageTab"}
            key={n}
            onClick={() => {
              setPage(n);
              window.scrollTo(0, parseInt(document.body.style.top || "0", 10) * -1);
            }}
          >
            {n}
          </button>
        ))}
        <button className='rightHandle' onClick={nextPageHandler} disabled={page === numAllPages}>
          <BiRightArrowAlt size={19} />
        </button>
        <button className='rightHandle' onClick={lastPageHandler} disabled={page === numAllPages}>
          <BiArrowToRight size={20} />
        </button>
      </PageNum>
    </>
  );
}

export default Pagination;
