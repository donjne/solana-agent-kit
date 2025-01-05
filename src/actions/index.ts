import deployTokenAction from "./deployToken";
import balanceAction from "./balance";
import transferAction from "./transfer";
import deployCollectionAction from "./deployCollection";
import mintNFTAction from "./mintNFT";
import tradeAction from "./trade";
import requestFundsAction from "./requestFunds";
import resolveDomainAction from "./resolveDomain";
import getTokenDataAction from "./getTokenData";
import getTPSAction from "./getTPS";
import fetchPriceAction from "./fetchPrice";
import stakeWithJupAction from "./stakeWithJup";
import stakeWithSolayerAction from "./stakeWithSolayer";
import registerDomainAction from "./registerDomain";
import lendAssetAction from "./lendAsset";
import createGibworkTaskAction from "./createGibworkTask";
import resolveSolDomainAction from "./resolveSolDomain";
import pythFetchPriceAction from "./pythFetchPrice";
import getOwnedDomainsForTLDAction from "./getOwnedDomainsForTLD";
import getPrimaryDomainAction from "./getPrimaryDomain";
import getAllDomainsTLDsAction from "./getAllDomainsTLDs";
import getOwnedAllDomainsAction from "./getOwnedAllDomains";
import createImageAction from "./createImage";
import getMainAllDomainsDomainAction from "./getMainAllDomainsDomain";
import getAllRegisteredAllDomainsAction from "./getAllRegisteredAllDomains";
import raydiumCreateCpmmAction from "./raydiumCreateCpmm";
import raydiumCreateAmmV4Action from "./raydiumCreateAmmV4";
import createOrcaSingleSidedWhirlpoolAction from "./createOrcaSingleSidedWhirlpool";
import launchPumpfunTokenAction from "./launchPumpfunToken";
import getWalletAddressAction from "./getWalletAddress";
import getAssetsAction from "./getAssets";
import getSolanaDomainAction from "./getSolanaDomain";
import getAssetAction from "./getAsset";
import getBlockTransactionsAction from "./getBlockTransactions";
import getCNFTransactionsAction from "./getCNFTTransactions";
import getConcurrentMerkleTreeAction from "./getConcurrentMerkleTree";
import getAccountInfoAction from "./getAccountInfo";
import getCurrentSlotAction from "./getCurrentSlot";
import getDeprecatedImageAction from "./getDeprecatedImage";
import getNiftyAssetAction from "./getNiftyAsset";
import getPriceAction from "./getTokenPrice";
import getRawTransactionAction from "./getRawTransaction";
import searchAssetsAction from "./searchAssets";
import getTransactionAction from "./getTransaction";
import getTransactionsAction from "./getTransactions";

export const ACTIONS = {
  WALLET_ADDRESS_ACTION: getWalletAddressAction,
  DEPLOY_TOKEN_ACTION: deployTokenAction,
  BALANCE_ACTION: balanceAction,
  TRANSFER_ACTION: transferAction,
  DEPLOY_COLLECTION_ACTION: deployCollectionAction,
  MINT_NFT_ACTION: mintNFTAction,
  TRADE_ACTION: tradeAction,
  REQUEST_FUNDS_ACTION: requestFundsAction,
  RESOLVE_DOMAIN_ACTION: resolveDomainAction,
  GET_TOKEN_DATA_ACTION: getTokenDataAction,
  GET_TPS_ACTION: getTPSAction,
  FETCH_PRICE_ACTION: fetchPriceAction,
  STAKE_WITH_JUP_ACTION: stakeWithJupAction,
  STAKE_WITH_SOLAYER_ACTION: stakeWithSolayerAction,
  REGISTER_DOMAIN_ACTION: registerDomainAction,
  LEND_ASSET_ACTION: lendAssetAction,
  CREATE_GIBWORK_TASK_ACTION: createGibworkTaskAction,
  RESOLVE_SOL_DOMAIN_ACTION: resolveSolDomainAction,
  PYTH_FETCH_PRICE_ACTION: pythFetchPriceAction,
  GET_OWNED_DOMAINS_FOR_TLD_ACTION: getOwnedDomainsForTLDAction,
  GET_PRIMARY_DOMAIN_ACTION: getPrimaryDomainAction,
  GET_ALL_DOMAINS_TLDS_ACTION: getAllDomainsTLDsAction,
  GET_OWNED_ALL_DOMAINS_ACTION: getOwnedAllDomainsAction,
  CREATE_IMAGE_ACTION: createImageAction,
  GET_MAIN_ALL_DOMAINS_DOMAIN_ACTION: getMainAllDomainsDomainAction,
  GET_ALL_REGISTERED_ALL_DOMAINS_ACTION: getAllRegisteredAllDomainsAction,
  RAYDIUM_CREATE_CPMM_ACTION: raydiumCreateCpmmAction,
  RAYDIUM_CREATE_AMM_V4_ACTION: raydiumCreateAmmV4Action,
  CREATE_ORCA_SINGLE_SIDED_WHIRLPOOL_ACTION:
    createOrcaSingleSidedWhirlpoolAction,
  LAUNCH_PUMPFUN_TOKEN_ACTION: launchPumpfunTokenAction,
  GET_ACCOUNT_INFO_ACTION: getAccountInfoAction,
  GET_ASSETS_ACTION: getAssetsAction,
  GET_SOLANA_DOMAIN_ACTION: getSolanaDomainAction,
  GET_ASSET_ACTION: getAssetAction,
  GET_BLOCK_TRANSACTIONS_ACTION: getBlockTransactionsAction,
  GET_CNFT_TRANSACTIONS_ACTION: getCNFTransactionsAction,
  GET_CONCURRENT_MERKLE_TREE_ACTION: getConcurrentMerkleTreeAction,
  GET_CURRENT_SLOT_ACTION: getCurrentSlotAction,
  GET_DEPRECATED_IMAGE_ACTION: getDeprecatedImageAction,
  GET_NIFTY_ASSET_ACTION: getNiftyAssetAction,
  GET_PRICE_ACTION: getPriceAction,
  GET_RAW_TRANSACTION_ACTION: getRawTransactionAction,
  SEARCH_ASSETS_ACTION: searchAssetsAction,
  GET_TRANSACTION_ACTION: getTransactionAction,
  GET_TRANSACTIONS_ACTION: getTransactionsAction,
};

export type { Action, ActionExample, Handler } from "../types/action";
