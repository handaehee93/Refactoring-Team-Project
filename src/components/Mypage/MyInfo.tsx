import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {  patchNickname, removeUserData, userState } from '../../firebase';



export interface Props {
  list: any
}

function MyInfo({ list }: Props) {

  const [userUid, setUserUid] = useState<string>()
  const [userEmail, setUserEmail] = useState<string>()
  const [userNickname, setNickname] = useState<string>();
  const [newNickname, setNewNickname] = useState<string>('')
  const [editNickname, setEditNickname] = useState<boolean>(false);
  const [withDrawalModalOpen, setWithdrawalModalOpen] = useState<boolean>(false);
  const navigate = useNavigate()
  
  useEffect(() => {
    setUserEmail( list[0])
    setNickname(list[1])
    userState((user:any) => setUserUid(user.uid))
  },[])

  // 유저 닉네임 patch 요청
  const changeNickname = async () => {
    const patchUser = [userEmail, newNickname]
    userUid && patchNickname(userUid, patchUser)
    setEditNickname(false);
    window.location.reload();
  };

  // 유저 닉네임 변경 클릭 이벤트
  const onClickEditButton = () => {
    setEditNickname(!editNickname);
  };

  // 유저 닉네임 변경 체인지 이벤트
  const onChangeEditInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewNickname(e.target.value);
  };


  // 회원 탈퇴 모달 오픈 이벤트 핸들러
  const openModalHandler = () => {
    setWithdrawalModalOpen(!withDrawalModalOpen);
  };

  // 회원 탈퇴 delete 요청
  const withDrawal = async () => {
    userUid && removeUserData(userUid)
      .then(()=> {
        navigate("/");
        window.location.reload();
      })
  };

  return (
    <>
      <MySettingContainer>
        <PasswordWrapper>
          <div className='passwordTitle'>이메일</div>
          <div className='passwordArea'>{userEmail && userEmail}</div> 
        </PasswordWrapper>
          <WarningText>
            <div className='waringText'>회원가입한 이메일입니다.</div>
          </WarningText>
        <PasswordWrapper>
            <div className='passwordTitle'>닉네임</div>
            {editNickname ? (
              <input
                className='editPasswordArea'
                type='text'
                value={newNickname}
                onChange={onChangeEditInput}
              ></input>
            ) : (
              <div className='passwordArea'>{userNickname}</div>
            )}
            {editNickname ? (
              <EditPasswordBtn onClick={changeNickname}>저장</EditPasswordBtn>
            ) : (
              <EditPasswordBtn onClick={onClickEditButton}>수정</EditPasswordBtn>
            )}
          </PasswordWrapper>
            <WarningText>
              <div className='waringText'>회원가입시 입력한 닉네임</div>
            </WarningText>
      </MySettingContainer>
      <MyWithdrawalContainer>
        <MyWithdrawalWrapper>
          <div className='withdrawalTitle'>회원 탈퇴</div>
          <button className='withdrawalBtn' onClick={openModalHandler}>
            회원 탈퇴
          </button>
          {withDrawalModalOpen ? (
            <WithdrawalModalBack>
              <WithdrawalModalView>
                <div className='deleteModalTitle'>정말 탈퇴 하시겠습니까?</div>
                <div className='warningText'>
                  탈퇴 시 작성하신 다이어리 및 댓글이 모두 삭제되며
                  <br />
                  복구되지 않습니다.
                </div>
                <button className='deleteCancelButton' onClick={openModalHandler}>
                  취소
                </button>
                <button className='deleteButton' onClick={withDrawal}>
                  탈퇴
                </button>
              </WithdrawalModalView>
            </WithdrawalModalBack>
          ) : null}
        </MyWithdrawalWrapper>
        <WarningText>
          탈퇴 시 작성하신 다이어리 및 댓글이 모두 삭제되며 복구되지 않습니다.
        </WarningText>
      </MyWithdrawalContainer>
    </>
  );
}

export default MyInfo;

const MySettingContainer = styled.div`
  width: 100vw;
  max-width: 900px;
  font-size: 15px;
  margin-top: 30px;
`;

const PasswordWrapper = styled.div`

  display: flex;
  align-items: center;
  height: 50px;

  > .passwordTitle {
    color: ${(props) => props.theme.mainText};
    width: 100px;
    margin: 0 75px 0 30px;
    font-weight: 700;
    @media screen and (max-width: 600px) {
    margin: 0 50px 0px 20px;
    /* width: 120px; */
  }
  }

  > .editPasswordArea {
    width: 560px;
    color: ${(props) => props.theme.mainText};
    background-color: ${(props) => props.theme.background};
    border-radius: 4px;
    padding: 10px 8px 10px 8px;
    border: 0.5px solid ${(props) => props.theme.editBorder};
    &:focus {
      outline: none;
    }
  }

  > .passwordArea {
    color: ${(props) => props.theme.mainText};
    width: 560px;
  }

`;

const EditPasswordBtn = styled.button`
  color: ${(props) => props.theme.mainText};
  width: 100px;
  border: none;
  background-color: transparent;
  text-decoration: underline;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  /* @media screen and (max-width: 400px) {
    margin-right:80px;
  } */
`;

const MyWithdrawalContainer = styled.div`
  width: 100vw;
  max-width: 900px;
  font-size: 15px;
`;

const MyWithdrawalWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 50px;

  > .withdrawalTitle {
    color: ${(props) => props.theme.mainText};
    width: 100px;
    margin: 0 75px 0 30px;
    font-weight: 700;
  }

  > .withdrawalBtn {
    width: 100px;
    height: 33px;
    border: none;
    border-radius: 4px;
    background-color: #ff6b6c;
    font-weight: 700;
    color: white;
    cursor: pointer;
    &:hover {
      background-color: #ec1d36;
    }
  }
`;

const WarningText = styled.div`
  font-size: 13px;
  color: ${(props) => props.theme.diaryDate};
  padding-bottom: 10px;
  margin: 0 70px -5px 20px;
  /* margin:  */
  > .waringText {
    border-bottom: 1px solid ${(props) => props.theme.diaryInfoLine};
    padding-bottom: 15px;
  }

`;

const WithdrawalModalBack = styled.div`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
`;

const WithdrawalModalView = styled.div`
  text-align: center;
  border-radius: 5px;
  background-color: ${(props) => props.theme.background};
  width: 430px;
  height: 220px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.19), 0 10px 10px rgba(0, 0, 0, 0.1);

  > .deleteModalTitle {
    color: ${(props) => props.theme.mainText};
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    margin: 30px 0 35px 0;
  }

  > .warningText {
    color: ${(props) => props.theme.subText};
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 41.5px;
  }

  > button {
    font-weight: 500;
    width: 215px;
    height: 50px;
    color: white;
    border: none;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      text-decoration: none;
    }
  }

  > .deleteCancelButton {
    color: ${(props) => props.theme.subText};
    font-weight: 600;
    background-color: transparent;
    border-top: 1px solid ${(props) => props.theme.detailLine};
    border-right: 0.5px solid ${(props) => props.theme.detailLine};
    border-bottom-left-radius: 5px;
    &:hover {
      background-color: ${(props) => props.theme.likeHover};
    }
  }

  > .deleteButton {
    color: #ec1d36;
    font-weight: 600;
    background-color: transparent;
    border-top: 1px solid ${(props) => props.theme.detailLine};
    border-left: 0.5px solid ${(props) => props.theme.detailLine};
    border-bottom-right-radius: 5px;
    &:hover {
      background-color: ${(props) => props.theme.likeHover};
    }
  }
`;


      {/* <MyInfoContainer>
        <ProfileImgWrapper>
          <ProfileImg src={image} alt='프로필 이미지' onClick={clickProfile} />
          <ImgInput type='file' accept='image/*' onChange={saveImage} ref={fileInput} />
          <ImgSubmitBtn onClick={changeImage}>프로필 이미지 저장</ImgSubmitBtn>
        </ProfileImgWrapper>
        <NickNameWrapper>
          {userNickname}
          {editNickname ? (
            <input
              className='editNicknameArea'
              type='text'
              value={userNickname}
              onChange={onChangeEditInput}
              placeholder={list.nickname}
            ></input>
          ) : (
            <div className='nicknameArea'>{userNickname}</div>
          )} 
          {editNickname ? (
            <EditNicknameBtn onClick={changeNickname}>저장</EditNicknameBtn>
          ) : (
            <EditNicknameBtn onClick={onClickEditButton}>수정</EditNicknameBtn>
          )}
        </NickNameWrapper>
      </MyInfoContainer> */}

        // 선택한 이미지 patch 요청
  const changeImage = async () => {
    // const newImg = {
    //   imageUrl: image,
    //   nickname: list.nickname,
    //   password: list.password,
    // };
    // const res = await TOKEN_API.patch(`/users/${list.userId}`, newImg);
    // setImage(res.data);
    // window.location.reload();
  };


            {/* <PasswordWrapper>
            <div className='passwordTitle'>비밀번호</div>
            {editPassword ? (
              <input
                className='editPasswordArea'
                type='text'
                value={password}
                onChange={onChangePasswordInput}
              ></input>
            ) : (
              <div className='passwordArea'>********</div>
            )}
            {editPassword ? (
              <EditPasswordBtn onClick={changePassword}>저장</EditPasswordBtn>
            ) : (
              <EditPasswordBtn onClick={onClickPasswordButton}>수정</EditPasswordBtn>
            )}
          </PasswordWrapper> */}