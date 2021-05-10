import React, {useState, useEffect} from 'react';
import styled from"styled-components";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import mainTheme from "../styles/main";
import PageWrapper from "../styles/Page";
import Loading from "../components/Loading";
import Toast from "../services/SignalService";

const ContentWrapper = styled.div`
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: column;
  width: 50vw;
  height: 90vh;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const ImageWrapper = styled.img`
  height: 70%;
  width: auto;
  border-radius: 5%;
  filter: drop-shadow(0 0 1vh ${props => props.theme.colours.detailsTwo});
`

const VideoWrapper = styled.iframe`
  height: 70%;
  width: auto;
  border-radius: 5%;
  filter: drop-shadow(0 0 1vh ${props => props.theme.colours.detailsTwo});
`

const HomeScreen = props => {

    const [apod, setApod] = useState({});
    const [fetched, setFetched] = useState(false);

    const getAPOD = async () => {
        try {
            const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
            if (response.ok) {
                const data = await response.json();
                setApod(data);
                setFetched(true);
            } else {
                Toast('Failed to fetch data from NASA API');
                setFetched(false);
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getAPOD()
    },[]);

    useEffect(() => {
        console.log(apod);
    }, [apod])

    return (
        <>
            <PageWrapper>
                <ContentWrapper>
                    Mikołaj Siebielec
                </ContentWrapper>
                <ContentWrapper>
                {fetched ?
                    <ContentWrapper>
                        <p style={{fontSize: mainTheme.fonts.size.m}}> {apod.date} <br/> {apod.title}</p>
                        {apod.media_type === "image" ?
                            <ImageWrapper title={apod.explanation} src={apod.hasOwnProperty("hdurl") ? apod.hdurl : apod.url}/>
                            :
                            <VideoWrapper title={apod.explanation} src={apod.url}/>
                        }
                        <p style={{fontSize: mainTheme.fonts.size.s}}>{apod.copyright}</p>
                    </ContentWrapper>
                    :
                    <Loading type={"spin"} color={mainTheme.colours.details} height={"20%"} />
                }
                </ContentWrapper>
        </PageWrapper>
        <ToastContainer />
        </>
    )
}

export default HomeScreen