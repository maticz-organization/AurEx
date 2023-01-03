// import package
import React, { useContext, useEffect } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { Hidden, Button, Menu, MenuItem } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TimeAgo } from "@n1ru4l/react-time-ago";
import SocketContext from "../Context/SocketContext";
import Profileicon from "../../assets/images/circle_card_section.png"

// import action
import { logout } from "../../actions/users";
import { setTradeTheme, setTheme } from "../../actions/commonAction";
// import {
//   SET_UNREAD_NOTICE,
//   UPDATE_NOTICE_POPUP
// } from '../constant';
import {
  readNotification,
  FetchunReadNotice,
  noticePopup,
} from "../../actions/notificationAction";

//lib
import { momentFormat } from "../../lib/dateTimeHelper";
import isEmpty from "lib/isEmpty";

export default function HeaderLinks(props) {
  const dispatch = useDispatch();
  const socketContext = useContext(SocketContext);
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const { t, i18n } = useTranslation();

  // state
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElNoti, setAnchorElNoti] = React.useState(null);

  // redux state
  const themeData = useSelector((state) => state.theme);
  const { isAuth } = useSelector((state) => state.auth);
  const { unread, isOpen } = useSelector((state) => state.notice);

  // redux-state
const accountData = useSelector(state => state.account);
const { firstName, lastName, email, blockNo, address, state, city, postalCode, country } = accountData;

  // function'
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickNotification = async (event,val) => {
    // alert(1);
    if(val=="readall")
    {
      let { staus, message } = await readNotification();
    }
    setAnchorElNoti(event.currentTarget);
    // document.getElementsByTagName("body")[0].style.overflow ="auto";
    document.getElementsByTagName("body")[0].classList.add("padi_over_body");


  };

  
  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleCloseNotification = () => {
    setAnchorElNoti(null);
    document.getElementsByTagName("body")[0].style.overflow ="auto";
    document.getElementsByTagName("body")[0].style.paddingRight ="0px";

  };




  
  const readAllMsg = async () => {
    let { staus, message } = await readNotification();
    noticePopup(dispatch, false);
  };

  const closeBox = (event) => {
    // console.log(event.currentTarget,"event");
    // event.stopPropogation();
    noticePopup(dispatch, true);
  };

  // document.getElementsByTagName("body")[0].onclick(function(event)
  // {
  //   console.log(event.currentTarget,"event");
  // });

  useEffect(() => {
    socketContext.socket.on("notice", (result) => {
      FetchunReadNotice(dispatch, result);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (isOpen) {
        readAllMsg();
      }
    };
  }, [isOpen]);

  return (
    <div className="inner_page_menu">
      <div className="dashboard_login">
        <Hidden smDown>
          <ul className="list-iline">
            {isAuth && (
              <li>
                <NavLink to="/dashboard">{t("DASHBOARD")}</NavLink>
              </li>
            )}
            {
              <li>
                <NavLink to="/spot">{t("MARKET")}</NavLink>
              </li>
            }
            {isAuth && (
              <li>
                <NavLink to="/wallet">{t("WALLET")}</NavLink>
                {/* <Link to="/walletnew">Wallet</Link> */}
              </li>
            )}
            {isAuth && (
              <li>
                <NavLink to="/launchpad">Launchpad</NavLink>
                {/* <Link to="/walletnew">Wallet</Link> */}
              </li>
            )}
            {
              isAuth && <li>
                <NavLink to="/staking">{t('STAKING')}</NavLink>
              </li>
            }

{isAuth && (
              <>
              <li className="noti_parent_po notiification_link_for_web">
                {unread && unread.length > 0 ? (
                  <span className="notify_count">
                    {unread && unread.length}
                  </span>
                ) : null}
                {isOpen == false ? (
                  // <Button
                  //   class="btn btnNotification"
                  //   type="button"
                  //   data-toggle="collapse"
                  //   data-target="#notificationDropdown"
                  //   onClick={closeBox}
                  //   aria-expanded="false"
                  //   aria-controls="notificationDropdown"
                  // >
                  <Button
                  aria-controls="notificationDropdown"
                  aria-haspopup="true"
                  onClick={handleClickNotification}
                >
                    <i className="fas fa-bell"></i>
                  </Button>
                ) : (
                  <Button
                  aria-controls="notificationDropdown"
                  aria-haspopup="true"
                  onClick={()=>{handleClickNotification("readall")}}
                >
                    <i className="fas fa-bell"></i>
                  </Button>
                )}
                <Menu
                  id="notificationDropdown"
                  className="afterlogin_hr"
                  anchorEl={anchorElNoti}
                  keepMounted
                  open={Boolean(anchorElNoti)}
                  onClose={handleCloseNotification}
                >
               
                  <div className="notificationDropdown noti_child_po">
                    {!isEmpty(unread) && unread.length > 0 ? (
                      <>
                      <div className="text-right">
                        <button onClick={()=>{readAllMsg()}} className="mark_read_link">Mark all as read </button>
                        </div>
                        <ul>
                          {unread &&
                            unread.length > 0 &&
                            unread.map((item) => {
                              return (
                                <li>
                                  <p>
                                    <TimeAgo date={new Date(item.createdAt)}>
                                      {({ value }) => value}
                                    </TimeAgo>
                                  </p>
                                  <h5>{item.description}</h5>
                                </li>
                              );
                            })}
                        </ul>
                      </>
                    ) : (
                      <>
                        <ul>
                          <li>
                            <h5>No more unread Notifications ...</h5>
                          </li>
                        </ul>
                      </>
                    )}

                    <p className="text-center pb-3 pt-2">
                      <Link to="/notification" className="all_noti_link_green">All Notifications</Link>
                    </p>
                  </div>
                  </Menu>
            
              </li>

              <li className="notiification_link_for_mob"><a href="/notification">Notifications</a></li>
              </>
            )}
            {isAuth && (
              <li className="li_ellipse_menu ">
                <Button
                  aria-controls="profile_menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                    {/* <div className="d-flex prof_icon_header"> */}
                      {/* <div> */}
                        <img src={Profileicon} className="prof_icon_header" alt="profileicon"/> 
                        {/* </div> */}
                          {/* </div> */}

                  {/* <i className="fas fa-user"></i> */}
                  {/* <i class="fas fa-ellipsis-h"></i> */}
                </Button>
                <Menu
                  id="profile_menu"
                  className="afterlogin_hr"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                    <NavLink to="/profile"><MenuItem className="px-2">
                    <div className="d-flex afterlogin_profile"><div><img src={Profileicon}  alt="profileicon"/> </div><div><p className="mx-3 mb-0 first">{`${firstName} ${lastName}`}</p>
<p className="second mb-0 mx-3">{email}</p></div> </div>
                  </MenuItem></NavLink>
                                
                  <NavLink to="/profile">        
                  <MenuItem>
                    <i className="fa fa-user" aria-hidden="true"></i><span>Profile</span>
                  </MenuItem>
                  </NavLink>
                  <hr/> 
                  <NavLink to="/launchpad"><MenuItem><i className="fa fa-rocket" aria-hidden="true"></i><span>Launchpad</span></MenuItem></NavLink>
                  <hr/> 
                  <NavLink to="/staking"><MenuItem><i class="fab fa-stack-exchange"></i><span>Staking</span></MenuItem></NavLink>
                  <hr/> 
                  <NavLink to="/security"><MenuItem>
                    <i className="fa fa-lock" aria-hidden="true"></i><span>Security</span>
                  </MenuItem></NavLink>
                  
                  <hr/> 
                  <NavLink to="/setting">
                  <MenuItem>
                    <i className="fa fa-cog" aria-hidden="true"></i><span>Settings</span>
                  </MenuItem>
                  </NavLink>
                 
                  <hr/> 
                  <NavLink to="/orders">
                  <MenuItem>
                    <i className="fa fa-list" aria-hidden="true"></i><span>Orders</span>
                  </MenuItem>
                  </NavLink>
                  {/* <hr/> 
                  <MenuItem>
                    <Link to="/referral"><i className="fa fa-users" aria-hidden="true"></i><span>Referral</span></Link>
                  </MenuItem> */}
                  <hr/> 
                  {/* <MenuItem><Link to="/notification">Notifications</Link></MenuItem> */}
                  <NavLink to="/history"><MenuItem>
                    <i className="far fa-clock"></i><span>History</span>
                  </MenuItem>
                  </NavLink>
                  <hr/> 
                  <NavLink to="/support-ticket">
                  <MenuItem>
                    <i className="fa fa-question-circle" aria-hidden="true"></i><span>Support</span>
                  </MenuItem>
                  </NavLink>
                  {/* <MenuItem>
                    <Link to="/orders">Orders</Link>
                  </MenuItem> */}
                  {/* <MenuItem><Link to="/api-management">API Management</Link></MenuItem> */}
                  <Link to="#" onClick={() => logout(history, dispatch)}>
                  <MenuItem>
                   
                    <i className="fas fa-sign-out-alt"></i> <span> Logout</span>
                  
                  </MenuItem>
                  </Link>
                </Menu>
              </li>
            )}

            {/* {
            
             
             <li>
                <div className="toggleMode" title="toggle dark mode">
                  <label>
                    <input type="checkbox" checked={themeData == 'light' ? true : false} name="" onClick={() => setTheme(dispatch, themeData == 'light' ? 'dark' : 'light')} />
                    <span></span>
                  </label>
                </div>
              </li>
            } */}
          </ul>
        </Hidden>
        <Hidden only={["md", "lg", "xl"]}>
          <ul className="list-iline">
            {/* {
             <li>
                <div className="toggleMode" title="toggle dark mode">
                  <label>
                    <input type="checkbox" checked={themeData == 'light' ? true : false} name="" onClick={() => setTheme(dispatch, themeData == 'light' ? 'dark' : 'light')} />
                    <span></span>
                  </label>
                </div>
              </li>
            } */}

            <li>
              <NavLink to="/spot">Spot</NavLink>
            </li>
            {/*<li>
              <Link to="/derivative">Derivative</Link>
            </li>*/}

            {isAuth && (
              <li>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </li>
            )}
            {isAuth && (
              <li>
                <NavLink to="/spot">Market</NavLink>
              </li>
            )}
            {/*{
              isAuth && <li>
                <Link to="/p2p">P2P</Link>
              </li>
            }*/}
            {isAuth && (
              <li>
                <NavLink to="/wallet">Wallet</NavLink>
                {/* <Link to="/walletnew">Wallet</Link> */}
              </li>
            )}

           
            {isAuth && (
              <li>
                <NavLink to="/notification">Notifications</NavLink>
              </li>
            )}

            {isAuth && (
              <li>
                <NavLink to="/profile">Profile</NavLink>
              </li>
            )}
              {
              isAuth && <li>
                <NavLink to="/launchpad">Launchpad</NavLink>
              </li>
            }
             {
              isAuth && 
              <li>
                <NavLink to="/staking">Staking</NavLink>
              </li>
            }
          
            {/* {
              isAuth && <li>
                <Link to="/profile">KYC</Link>
              </li>
            } */}

            {isAuth && (
              <li>
                <NavLink to="/security">Security</NavLink>
              </li>
            )}

            {isAuth && (
              <li>
                <NavLink to="setting">Settings</NavLink>
              </li>
            )}

            {isAuth && (
              <li>
                <NavLink to="/support-ticket">Support</NavLink>
              </li>
            )}

            {isAuth && (
              <li>
                <NavLink to="/referral">Referral</NavLink>
              </li>
            )}

            {isAuth && (
              <li>
                <NavLink to="/history">History</NavLink>
              </li>
            )}

            {isAuth && (
              <li>
                <NavLink to="/orders">Orders</NavLink>
              </li>
            )}

            {/* {
              isAuth && <li>
                <Link to="/api-management">API Management</Link>
              </li>
            } */}

            {isAuth && (
              <li>
                <Link to="#" onClick={() => logout(history, dispatch)}>
                  Logout
                </Link>
              </li>
            )}
          </ul>
        </Hidden>
      </div>
    </div>
  );
}
