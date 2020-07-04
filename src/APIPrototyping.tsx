import React, {useState, useEffect, useCallback} from 'react';
import JSZip from 'jszip';

// TODO: improve callback, organize full deck data, and remove duplicate state 
const useCardData = () => {
    // TODO: type
    const [cardData, setCardData] = useState("");
    useEffect(() => {
        const fetchCards = async () => {
            const dataUrl = "https://dd.b.pvp.net/latest/set1-lite-en_us.zip";
            const res = await fetch(dataUrl, {mode: 'no-cors'});
            console.log('DATA RESPONSE FROM API:\n', res)
            const zipBlob = await res.blob();
            const zip = await JSZip.loadAsync(zipBlob);
            const resourceContents = JSON.parse(zip.toString());
            console.log(typeof(res));
            // console.log(json);
            // setCardData(json);
        };
        fetchCards();
    }, []);

    return cardData;
}

const APIPrototyping = () => {
    const [lastGameData, setLastGameData] = useState("");
    const [deckCurrentData, setCurrentDeckData] = useState("");
    const [expeditionData, setExpeditionData] = useState("");
    const cardResources = useCardData();

    useEffect(() => {
        const defaultPort = 21337;
        const baseURL = `http://127.0.0.1:${defaultPort}`;
        const options: RequestInit = {mode: 'no-cors'};

        const requestLastGame = async () => {
            const res = await fetch(`${baseURL}/game-result`, options);
            const json = await res.json();
            setLastGameData(json);
        }

        const requestCurrentDeck = async () => {
            const res = await fetch(`${baseURL}/static-decklist`, options);
            const json = await res.json();
            setCurrentDeckData(json);
        }

        const requestExpeditionData = async () => {
            const res = await fetch(`${baseURL}/expeditions-state`, options);
            const json = await res.json();
            setExpeditionData(json);
        }

        const update = () => {
            requestLastGame();
            requestCurrentDeck();
            requestExpeditionData();
            console.log('updating');
        }

        update();
    }, []);

    return (
        <div>
            <h2>Last game</h2>
            <div>{lastGameData ? JSON.stringify(lastGameData) : null}</div>
            <h2>Current deck</h2>
            <div>{deckCurrentData ? JSON.stringify(deckCurrentData) : null}</div>
            <h2>Expedition data</h2>
            <div>{expeditionData ? JSON.stringify(expeditionData) : null}</div>
            {/* <button onClick={() => handleButtonClick()}>Download card data</button> */}
            <div>
                <h2>Cards</h2>
                <div>
                    {cardResources}
                </div>
            </div>
        </div>
    )
};

export default APIPrototyping;