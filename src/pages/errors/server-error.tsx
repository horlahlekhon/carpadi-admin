import MainLayout from '../../components/layouts/MainLayout'
import styled from 'styled-components'
import {Grid, Paper, Radio, Typography, withStyles} from '@material-ui/core'
import Button from '../../components/shared/Button'
import {t} from '../../styles/theme'
import {useRouter} from "next/router";


function ServerErrorPage() {
    const router = useRouter()

    return (
        <Container>
            <MainSection>
                <div className='actions'>
                    <img src='/logos/blue-full.png' style={{width: '270px', marginLeft: '-15px'}}/>
                    <div className='error-code'>500</div>
                    <div className='error-text'>That’s an error.</div>
                    <div className='error-text'>An unknown error occurred. We are working towards resolving it.</div>

                    <Button text='Return Home' width={208} marginTop={40} onClick={() => router.replace('/')}/>
                </div>
                <img className='image' src="/errors/500.jpg"/>
            </MainSection>
        </Container>
    )
}

export default ServerErrorPage

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const MainSection = styled.div`
  margin: 87px 84px;
  background: transparent;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .actions {
    width: 35vw;
    display: inherit;
    flex-direction: column;
    padding-top: 40px;

    .error-code {
      font-weight: bolder;
      font-size: 104px;
      margin-top: 95px;
    }

    .error-text {
      margin-top: 12px;
      font-size: 18px;
      font-weight: lighter;
    }
  }

  .image {
    height: 100%;
    width: 65vw;
  }
`
