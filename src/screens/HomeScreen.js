import React, {useState, useEffect} from 'react';
import styled, {ThemeProvider} from"styled-components";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import mainTheme from "../styles/main";
import Loading from "../components/Loading";

const PageWrapper = styled.div`
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: row;
  justify-content: left;
  width: 100vw;
  height: 90vh;
  background-image: linear-gradient(180deg, ${props => props.theme.colours.primary}, ${props => props.theme.colours.details});
  font-family: ${props => props.theme.fonts.family};
  font-size: ${props => props.theme.fonts.size.l};
  -webkit-text-fill-color: ${props => props.theme.colours.secondary};
`

const ContentWrapper = styled.main`
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
  width: 75%;
  height: auto;
`

const VideoWrapper = styled.video`
  width: 75%;
  height: auto;
`

const HomeScreen = (props) => {

    const [apod, setApod] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const toastError = () => toast.error('Failed to fetch data from NASA API');

    const getAPOD = () => {

        fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
            .then(res => res.ok ? res.json() : toastError())
            .then(data => setApod(data)).then(loaded => setLoaded(true))
            .catch(err => console.error(err));
    }

    useEffect(() => {
        getAPOD()
    },[]);

    useEffect(() => {
        console.log(apod);
    }, [apod])

    return (
        <div>
        <ThemeProvider theme = {mainTheme}>
            <PageWrapper>
                <ContentWrapper>
                    Mikołaj Siebielec
                </ContentWrapper>
                <ContentWrapper>
                    {loaded ?
                        <ContentWrapper>
                            <p>{apod.date} <br/> {apod.title}</p>
                            {apod.media_type === "image" ?
                                <ImageWrapper src={apod.url}/>
                                :
                                <VideoWrapper src={apod.url}/>
                            }
                            <p>{apod.copyright}</p>
                        </ContentWrapper>
                        :
                        <Loading type={"spin"} color={mainTheme.colours.details} height={"20%"} />
                    }
                </ContentWrapper>
        </PageWrapper>
        </ThemeProvider>
        <ToastContainer />
        </div>
    )
}

export default HomeScreen