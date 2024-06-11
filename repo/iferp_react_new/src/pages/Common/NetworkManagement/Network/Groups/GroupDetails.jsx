import Modal from 'components/Layout/Modal'
import Profile from 'components/Layout/Profile';
import { useDispatch } from 'react-redux';
import { setRProfileID } from 'store/slices';

   const GroupDetails = ( {onHide ,groupData}) => {
  const dispatch = useDispatch();
  const {joined_members}=groupData; 
  return (
    <Modal onHide={onHide}>
            <div className='row cps-15 cpe-15 cpt-15 cpb-15'>
                {
                  joined_members.map((elem,index)=>{
                    const {user_details }=elem;   
                    const {name,profile,user_type,id}=user_details;        
                    const isOpenData = ["2","5"].includes(user_type); 

                      return(                  
                            <div className="col-md-6 col-12 cmb-20" key={index}>
                              <div className="col-md-12 border cps-12 cpe-12 cpt-12 cpb-12">
                                <div className="d-flex align-items-center">
                                  <div className="profile-block-data center-flex  bg-new-car-light color-raisin-black bg-white">
                                    <Profile url={ profile} isS3UserURL isRounded text={name} />
                                   </div>
                                   <div className="ms-3">
                                    <div className={`text-20-500  ${isOpenData ? "color-title-navy pointer" :"color-raisin-black"}  `}  
                                    onClick={() => {
                                           if (isOpenData) {
                                             dispatch(setRProfileID(id));
                                               }
                                            }}>
                                              {name}                   
                                      </div>
                                   </div>
                                 </div>
                              </div>
                            </div>                                     
                          )
                        })     
                }                             
            </div>
</Modal>
  )
}

export default GroupDetails