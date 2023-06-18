import MainLayout from '../components/layouts/MainLayout'
import styled from 'styled-components'
import {Avatar, Grid, Paper, Radio, Typography, withStyles} from '@material-ui/core'
import Button from '../components/shared/Button'
import {t} from '../styles/theme'
import {ArrowBackIos, ArrowForwardIos} from '@material-ui/icons'
import PieChart from '../components/charts/PieChart'
import {useEffect, useState} from 'react'
import CPToast from "../components/shared/CPToast";
import {accountService} from "../services/account";
import {toast} from "react-hot-toast";
import {formatNumber} from "../helpers/formatters";
import {months} from "../lib/constants";
import {authService} from "../services/auth";


function UserProfilePage() {
    const user = authService.userValue

    return (
        <Container>
            <CPToast/>
            <Header>
                <Typography variant="h4">
                    <b>Admin Profile</b>
                </Typography>
            </Header>
            <MainSection>
                {user?.profile_picture && <img loading="lazy"
                    className="image"
                    src="/images/Big-Default-Car.png"
                    alt="James Dalles"
                />}
                {!user?.profile_picture &&
                    <Avatar
                        className='image'>{String(user?.first_name).slice(0, 1) + String(user?.last_name).slice(0, 1)}</Avatar>}
                <Flex>
                    <Typography variant='h4'
                                className='mx-auto'><b>{user?.first_name} {user?.last_name}</b></Typography>
                    <Typography variant='body1' className='mx-auto'>NA, NA</Typography>
                </Flex>
                <Flex style={{marginTop: '32px'}}>
                    <BlueTextTypography variant='h5'
                                        className='mx-auto'><b>Username</b></BlueTextTypography>
                    <Typography variant='body1' className='mx-auto'>{user?.username}</Typography>
                </Flex>
                <Flex style={{marginTop: '32px'}}>
                    <BlueTextTypography variant='h5'
                                        className='mx-auto'><b>Address</b></BlueTextTypography>
                    <Typography variant='body1' className='mx-auto'>NA</Typography>
                </Flex>
                <Flex style={{marginTop: '32px'}}>
                    <BlueTextTypography variant='h5'
                                        className='mx-auto'><b>Email Address</b></BlueTextTypography>
                    <Typography variant='body1' className='mx-auto'>{user?.email}</Typography>
                </Flex>
                <Flex style={{marginTop: '32px'}}>
                    <BlueTextTypography variant='h5'
                                        className='mx-auto'><b>Mobile</b></BlueTextTypography>
                    <Typography variant='body1' className='mx-auto'>{user?.phone}</Typography>
                </Flex>
            </MainSection>
        </Container>
    )
}

export default UserProfilePage

UserProfilePage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

const BlueTextTypography = withStyles({
    root: {
        color: `${t.primaryBlue}`
    }
})(Typography)

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;

  .fit {
    width: fit-content;
  }

  .mx-auto {
    margin-right: auto;
    margin-left: auto;
  }
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`
const MainSection = styled.div`
  background: white;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;

  .image {
    border-radius: 50%;
    height: 160px;
    width: 160px;
    margin-bottom: 24px;
    object-fit: cover;
  }
`
