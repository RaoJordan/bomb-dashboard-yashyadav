import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useBombStats from '../../hooks/useBombStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsBTC from '../../hooks/useLpStatsBTC';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usebShareStats from '../../hooks/usebShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';

// import { Bomb as bombTesting } from '../../bomb-finance/deployments/deployments.testing.json';
//import { Bomb as bombProd } from '../../bomb-finance/deployments/deployments.mainnet.json';
import { roundAndFormatNumber } from '../../0x';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';
import { Alert } from '@material-ui/lab';
import { IoCloseOutline } from 'react-icons/io5';
import { BiLoaderAlt } from 'react-icons/bi';
import { makeStyles } from '@material-ui/core/styles';
import useBombFinance from '../../hooks/useBombFinance';
//import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { Helmet } from 'react-helmet';
import BombImage from '../../assets/img/bomb.png';
import './styles.css';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import moment from 'moment';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import { getDisplayBalance } from '../../utils/formatBalance';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import ExchangeStat from '../Bond/components/ExchangeStat';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';

//import useBombMaxiStats from '../../hooks/useBombMaxiStats';

import HomeImage from '../../assets/img/background.jpg';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'bomb.money | BTC pegged algocoin';

// const BackgroundImage = createGlobalStyle`
//   body {
//     background-color: grey;
//     background-size: cover !important;
//   }
// `;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      // marginTop: '10px'
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const bombFtmLpStats = useLpStatsBTC('BOMB-BTCB-LP');
  const bShareFtmLpStats = useLpStats('BSHARE-BNB-LP');
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const bombFinance = useBombFinance();
  const currentEpoch = useCurrentEpoch();
  const { to } = useTreasuryAllocationTimes();
  const totalStaked = useTotalStakedOnBoardroom();

  // const bombmaxi = useBombMaxiStats('0xd6f52e8ab206e59a1e13b3d6c5b7f31e90ef46ef000200000000000000000028');

  // console.log(bombmaxi);
  // let bomb;
  // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  //   bomb = bombTesting;
  // } else {
  //   bomb = bombProd;
  // }

  const buyBombAddress = //'https://app.1inch.io/#/56/swap/BTCB/BOMB';
    //  'https://pancakeswap.finance/swap?inputCurrency=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&outputCurrency=' +
    'https://app.bogged.finance/bsc/swap?tokenIn=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&tokenOut=0x522348779DCb2911539e76A1042aA922F9C47Ee3';
  //https://pancakeswap.finance/swap?outputCurrency=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBShareAddress = //'https://app.1inch.io/#/56/swap/BNB/BSHARE';
    'https://app.bogged.finance/bsc/swap?tokenIn=BNB&tokenOut=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBusmAddress =
    'https://app.bogged.finance/bsc/swap?tokenIn=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&tokenOut=0x6216B17f696B14701E17BCB24Ec14430261Be94A';
  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const bshareLPStats = useMemo(() => (bShareFtmLpStats ? bShareFtmLpStats : null), [bShareFtmLpStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const bombLpZap = useZap({ depositTokenName: 'BOMB-BTCB-LP' });
  const bshareLpZap = useZap({ depositTokenName: 'BSHARE-BNB-LP' });

  //calculating TWAP
  const cashPrice = useCashPriceInLastTWAP();
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4);

  const [onPresentBombZap, onDissmissBombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBombZap();
      }}
      tokenName={'BOMB-BTCB-LP'}
    />,
  );

  const [onPresentBshareZap, onDissmissBshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBshareZap();
      }}
      tokenName={'BSHARE-BNB-LP'}
    />,
  );

  const [modal, setModal] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const openModal = () => {
    setModal(!modal);
  };

  const spinner = () => {
    setVideoLoading(!videoLoading);
  };

  // const [onPresentIntroVid] = useModal(
  //   <grid>
  //     <Paper>
  //       <div>
  //         <iframe
  //           width="560"
  //           height="315"
  //           src="https://www.youtube.com/embed/nhCWmmRNNhc"
  //           title="YouTube video player"
  //           frameborder="0"
  //           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  //           allowfullscreen
  //         ></iframe>
  //       </div>
  //     </Paper>
  //   </grid>,
  // );

  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />
      <Grid container spacing={3}>

        <Grid item xs={12} sm={12}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ marginTop: '2.5%' }}>
              {/* <h2 style={{ marginBottom: '20px' }}>Wallet Balance</h2> */}
              <h2 style={{ textAlign: 'center', margin: '5px' }}>
                Bomb Finance Summary
              </h2>
              <hr></hr>

              <div className="container">
                <div className="grid1">
                  <table class="table" style={{ height: '100%' }}>
                    <thead>
                      <tr>
                        <td></td>
                        <td>Current Supply</td>
                        <td>Total Supply </td>
                        <td>Price</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>$BOMB</th>
                        <td>{roundAndFormatNumber(bombCirculatingSupply, 2)} <br /></td>
                        <td>{roundAndFormatNumber(bombTotalSupply, 2)}</td>
                        <td>
                          ${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'}
                          <br></br>
                          <span>
                            {bombPriceInBNB} BTCB
                          </span>

                        </td>
                      </tr>
                      <tr>
                        <th >$BSHARE</th>
                        <td>{roundAndFormatNumber(bShareCirculatingSupply, 2)} <br /></td>
                        <td>{roundAndFormatNumber(bShareTotalSupply, 2)}</td>
                        <td>
                          ${bSharePriceInDollars ? bSharePriceInDollars : '-.--'}
                          <br></br>
                          {bSharePriceInBNB} BTCB
                        </td>
                      </tr>
                      <tr>
                        <th >$BBOND</th>
                        <td>{tBondCirculatingSupply}</td>
                        <td>{tBondTotalSupply}</td>
                        <td>
                          ${tBondPriceInDollars}
                          <br></br>
                          {tBondPriceInBNB} BTCB
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="grid2">
                  <Card style={{ float: 'right' }}>
                    <CardContent align="center" style={{ position: 'relative' }}>

                      <h3 style={{ marginBottom: '10px' }}>Current Epoch</h3>
                      <span style={{ fontSize: '30px' }}>
                        {Number(currentEpoch)}
                      </span>
                      <hr></hr>

                      <span style={{ fontSize: '30px' }}>
                        <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                      </span>
                      <h3 style={{ marginBottom: '10px' }}>Next Epoch in</h3>
                      <hr></hr>

                      <span style={{ fontSize: '20px' }}>
                        Live Twap : <span style={{color: 'green'}}>&nbsp;{bondScale}</span> 
                        <br></br>
                        TVL: <span style={{color: 'green'}}>&nbsp;{TVL}</span> 
                        <br></br>
                        Last Epoch TWAP: <span style={{color: 'green'}}>&nbsp;{bondScale}</span>
                      </span>

                    </CardContent>
                  </Card>
                </div>
              </div>


            </CardContent>
          </Card>
        </Grid>

        {/* BoardRoom */}
        <Grid item xs={12} sm={8}>
          <div style={{ textAlign: 'right', margin: '5px' }}>
            <a href="" style={{ textDecoration: 'underline', color: 'white' }} >Read Investment Strategy &gt;</a>
          </div>

          <Button href="" className="blueButton" style={{ margin: '5px', width: '98%' }}>
            Invest Now
          </Button>
          <Button href="https://discord.bomb.money"
            rel="noopener noreferrer"
            target="_blank"
            className="shinyButton" style={{ margin: '7px', width: '48%' }}>

            Chat on Discord
          </Button>
          <Button href="https://docs.bomb.money"
            rel="noopener noreferrer"
            target="_blank" className="shinyButton" style={{ margin: '8px', width: '48%' }}>
            Read Docs
          </Button>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2 style={{ textAlign: 'left', margin: '5px', paddingRight: '10px' }}>
                Boardroom
                <button className="recButton" style={{ alignContent: 'center', marginLeft: '15px' }}>Recommended</button>
              </h2>
              <div className="conthalf">
                <span>Stake BSHARE and earn BOMB every epoch</span>
                <span>TVL: ${TVL}</span>
              </div>
              <hr></hr>
              <div style={{ textAlign: 'right' }}>Total Staked : {getDisplayBalance(totalStaked)}</div>
              <br></br>

              <div className="conthalf">
                <span>
                  <table class="table table-bordered table-dark">
                    <thead>
                      <tr>
                        <th scope="col">Daily Returns:</th>
                        <th scope="col">Your Stake</th>
                        <th scope="col">Earned:</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontSize: '30px', textAlign: 'center' }}>2%</td>
                        <td style={{ textAlign: 'center' }}>124.21</td>
                        <td style={{ textAlign: 'center' }}>6.4413</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style={{ textAlign: 'center' }}>$1171.62</td>
                        <td style={{ textAlign: 'center' }}>$298.88</td>
                      </tr>

                    </tbody>
                  </table>
                </span>
                <span>
                  <button href="" className="simpleButtons" style={{ margin: '5px', width: '46%' }}> Deposit</button>
                  <button href="" className="simpleButtons" style={{ margin: '5px', width: '46%' }}> Withdraw</button>
                  <button href="" className="simpleButtons" style={{ margin: '5px', width: '98%' }}> Claim Rewards</button>
                </span>
              </div>

            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center">
              <h3>Latest News</h3>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
            </CardContent>
          </Card>
        </Grid>

        {/*Bomb Farms*/}

        <Grid item xs={12} sm={12}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ marginTop: '1%' }}>
              <div className="conthalf">
                <span style={{ margin: '5px' }}>
                  <h3>Bomb Farms</h3>
                  Stake BSHARE and earn BOMB every epoch
                </span>
                <span>
                  <button href="" className="simpleButtons" style={{ marginRight: '50px', width: '100%' }}>Claim All</button>
                </span>
              </div>

              <div className="conthalf">
                <span>
                  <h2 style={{ textAlign: 'left', margin: '5px', paddingRight: '10px' }}>
                    Bomb-BTCB
                    <button className="recButton" style={{ alignContent: 'center', marginLeft: '15px' }}>Recommended</button>
                  </h2>
                </span>
                <span>TVL: ${TVL}</span>
              </div>
              <hr></hr>

              <div className="conthalf">
                <span>
                  <table class="table table-bordered table-dark">
                    <thead>
                      <tr>
                        <th scope="col">Daily Returns:</th>
                        <th scope="col">Your Stake</th>
                        <th scope="col">Earned:</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontSize: '30px', textAlign: 'center' }}>2%</td>
                        <td style={{ textAlign: 'center' }}>124.21</td>
                        <td style={{ textAlign: 'center' }}>6.4413</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style={{ textAlign: 'center' }}>$1171.62</td>
                        <td style={{ textAlign: 'center' }}>$298.88</td>
                      </tr>

                    </tbody>
                  </table>
                </span>
                <span>
                  <button href="" className="simpleButtons" style={{ margin: '5px', width: '46%' }}> Deposit</button>
                  <button href="" className="simpleButtons" style={{ margin: '5px', width: '46%' }}> Withdraw</button>
                  <button href="" className="simpleButtons" style={{ margin: '5px', width: '98%' }}> Claim Rewards</button>
                </span>
              </div>


            </CardContent>
          </Card>
        </Grid>

        {/*BSHARE BNB*/}

        <Grid item xs={12} sm={12} style={{ paddingTop: '0px' }}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ marginTop: '1%' }}>

              <div className="conthalf">
                <span>
                  <h2 style={{ textAlign: 'left', margin: '5px', paddingRight: '10px' }}>
                    BSHARE-BNB
                    <button className="recButton" style={{ alignContent: 'center', marginLeft: '15px' }}>Recommended</button>
                  </h2>
                </span>
                <span>TVL: ${TVL}</span>
              </div>
              <hr></hr>

              <div className="conthalf">
                <span>
                  <table class="table table-bordered table-dark">
                    <thead>
                      <tr>
                        <th scope="col">Daily Returns:</th>
                        <th scope="col">Your Stake</th>
                        <th scope="col">Earned:</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontSize: '30px', textAlign: 'center' }}>2%</td>
                        <td style={{ textAlign: 'center' }}>124.21</td>
                        <td style={{ textAlign: 'center' }}>6.4413</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style={{ textAlign: 'center' }}>$1171.62</td>
                        <td style={{ textAlign: 'center' }}>$298.88</td>
                      </tr>

                    </tbody>
                  </table>
                </span>
                <span>
                  <button href="" className="simpleButtons" style={{ margin: '5px', width: '46%' }}> Deposit</button>
                  <button href="" className="simpleButtons" style={{ margin: '5px', width: '46%' }}> Withdraw</button>
                  <button href="" className="simpleButtons" style={{ margin: '5px', width: '98%' }}> Claim Rewards</button>
                </span>
              </div>


            </CardContent>
          </Card>
        </Grid>

        {/*Bonds*/}

        <Grid item xs={12} sm={12} style={{ paddingTop: '10px' }}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ marginTop: '1%' }}>

              <div className="conthalf">
                <span>
                  <h2 style={{ textAlign: 'left', margin: '5px', paddingRight: '10px' }}>
                    Bonds
                  </h2>
                  <p style={{ marginTop: '0px', marginLeft: '5px' }}>BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1</p>
                </span>
              </div>

              <div class="contain">
                <div class="column">
                  <p style={{ fontSize: '13px' }}>Current Price: (Bomb)^2</p>
                  <p style={{ fontSize: '23px', fontWeight: 'bold' }}>
                    <ExchangeStat
                      tokenName="10,000 BBOND"
                      price={Number(tBondStats?.tokenInFtm).toFixed(4) || '-'}
                    />
                  </p>
                </div>
                <div class="column">
                  <p style={{ fontSize: '13px' }}>Available to redeem:</p>
                  <p style={{ fontSize: '23px', fontWeight: 'bold' }}> 456</p>
                </div>
                <div class="column">
                  <div className="conthalf" >
                    <span>
                      <p style={{ fontWeight: 'bold', marginBottom: '1px' }}>Purchase BBond</p>
                      <p style={{ marginTop: '1px' }}>Bomb is over peg</p>
                    </span>
                    <span>
                      <button href="" className="simpleButtons" style={{ margin: '5px', width: '95%' }} >Purchase</button>
                    </span>
                  </div>
                  <hr></hr>

                  <div className="conthalf" >
                    <span>
                      <p style={{ fontWeight: 'bold', marginBottom: '1px' }}>Redeem Bomb</p>
                    </span>
                    <span>
                      <button href="" className="simpleButtons" style={{ margin: '5px', width: '95%' }} >Redeem</button>
                    </span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Page>
  );
};



export default Home;
