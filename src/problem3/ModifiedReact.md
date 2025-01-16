interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // added blockchain to WalletBalance interface for consistency
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

//Instead of using a switch statement, you can improve the lookup time by using an object 
//to store blockchain priorities. This will make the function easier to maintain, especially 
//if the list of blockchains grows.
const blockchainPriorityMap: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // getPriority function could be optimized by using useCallback, 
  // since it does not change between renders. This will prevent creating the function on every render, 
  // saving memory and reducing the load on the application.

  const getPriority = useCallback((blockchain: string): number => {
    return blockchainPriorityMap[blockchain] ?? -99;
  }, []);


  
  const sortedBalances = useMemo(() => {

    // blockchain is not defined (because balance has the WalletBalance type but the WalletBalance interface does not include it),
    // so blockchain must be added to the WalletBalance interface.
    // In the filter function, lhsPriority is undefined and replaced by balancePriority, but creating an extra balancePriority variable is unnecessary.
    // balance.amount <= 0 is incorrect, it should be balance.amount > 0.
    // getPriority is called in both filter and sort for each element, which results in repeated calls.

    return balances
    .filter((balance: WalletBalance) => balance.amount > 0 && getPriority(balance.blockchain) > -99)
     // You can simplify the comparison by using  getPriority(rhs.blockchain) - getPriority(lhs.blockchain).
    .sort((lhs: WalletBalance, rhs: WalletBalance) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain))
    
  }, [balances, prices, getPriority]);
    //This code is memory optimized but if  readability and maintainability are a priority,
    //we should isolate the logic of getPriority and makes the filtering and sorting steps easier to follow.


  // Format to 2 decimals for better readability
  // It’s better to use useMemo with dependencies being sortedBalances
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(2) // format to 2 decimals
      }
    })
  }, [sortedBalances]);



  // Use formatted data (formattedBalances), so change sortedBalances to formattedBalances
  // Optimize rows with useMemo to prevent unnecessary renders
  const rows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow 
          className={classes.row}
          key={balance.currency} // Use a unique identifier, so replace index with balance.currency
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      )
    });
  }, [formattedBalances, prices]);

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
