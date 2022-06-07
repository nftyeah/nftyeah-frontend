import http from './axios.js';

export const getCollections = async (user_address,order_type,order_direction,page_no,page_size) => {
  return http({
    method: 'GET',
    url: `/nft/get_collections`,
    params: {user_address,order_type,order_direction,page_no,page_size}
  });
}

export const getCollectionsUn = async (user_address,order_type,order_direction,page_no,page_size) => {
  return http({
    method: 'GET',
    url: `/nft/get_collections_unrevealed`,
    params: {user_address,order_type,order_direction,page_no,page_size}
  });
}

export const getNotifyList = async (user_address) => {
  return http({
    method: 'GET',
    url: `/notify/get_notify_list`,
    params: {user_address}
  });
}

export const getCollectionsName = async (user_address) => {
  return http({
    method: 'GET',
    url: `/nft/get_collections_name`,
    params: {user_address}
  });
}

export const postAddNotify = async (object) => {
  return http({
    method: 'POST',
    url: `/notify/add_notify`,
    data: object
  });
}

export const postDelNotify = async (id,user_address,sign) => {
  return http({
    method: 'POST',
    url: `/notify/delete_notify`,
    data: {id,user_address,sign}
  });
}

export const postUpdateNotify = async (object) => {
  return http({
    method: 'POST',
    url: `/notify/update_notify`,
    data: object
  });
}

export const postAddEmail = async (object) => {
  return http({
    method: 'POST',
    url: `/email/add_email`,
    data: object
  });
}


export const getEmail = (user_address) => http({
  method: 'GET',
  url: `/email/get_email`,
  params: {user_address}
});


export const getTradeStat = async (user_address) => {
  return http({
    method: 'GET',
    url: `/order/get_trade_stat`,
    params: {user_address}
  });
}

export const getEvent = async (event_type, user_address) => {
  return http({
    method: 'GET',
    url: `/order/get_event`,
    params: {event_type, user_address}
  });
}

export const userNft = (user_address,cursor) => http({
  method: 'GET',
  url: `/nft/user_nft`,
  params: {user_address,cursor}
});

export const getNft = (token_address,token_id) => http({
  method: 'GET',
  url: `/nft/get_nft`,
  params: {token_address,token_id}
});

export const getOrder = (token_address,token_id) => http({
  method: 'GET',
  url: `/order/get_order`,
  params: {token_address,token_id}
});


export const sellOrder = (data) => http({
  method: 'POST',
  url: `/order/sell`,
  data: data
});


export const calcSavedAmount = (amount,token_address) => http({
  method: 'GET',
  url: `/order/calc_saved_amount`,
  params: {amount,token_address}
});

//
export const fetchBannerList = () => http({
  method: 'GET',
  url: `/banner/fetch_banner_list`,
});