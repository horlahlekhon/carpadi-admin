import styled from "styled-components";
import {t} from '../../../styles/theme'


function Loader() {

    return (
        <Box>
            <div className="bouncing-loader">
                <div style={{backgroundColor: t.primaryDeepBlue}}>&nbsp;</div>
                <div style={{backgroundColor: t.alertSuccess}}>&nbsp;</div>
                <div style={{backgroundColor: t.secondaryCyan}}>&nbsp;</div>
                <div style={{backgroundColor: t.alertValidation}}>&nbsp;</div>
            </div>
        </Box>
    )
}

export default Loader


const Box = styled.div`
  height: calc(100vh - 110px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .bouncing-loader {
    display: flex;
    justify-content: center;
  }

  .bouncing-loader > div {
    width: 16px;
    height: 16px;
    margin: 3px 6px;
    border-radius: 50%;
    background-color: #a3a1a1;
    opacity: 1;
    animation: bouncing-loader 0.6s infinite alternate;
  }

  @keyframes bouncing-loader {
    to {
      opacity: 0.1;
      transform: translateY(-16px);
    }
  }

  .bouncing-loader > div:nth-child(2) {
    animation-delay: 0.2s;
  }

  .bouncing-loader > div:nth-child(3) {
    animation-delay: 0.4s;
  }

`;
