import styles from './Checkout.module.css';
import { LoadingIcon } from './Icons';
import React from 'react';
import { getProducts } from './dataService';

// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Demo video - You can view how the completed functionality should look at: https://drive.google.com/file/d/1o2Rz5HBOPOEp9DlvE9FWnLJoW9KUp5-C/view?usp=sharing

// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places

const roundNumber = (number) => (Math.round(number * 100) / 100).toFixed(2);

const Product = ({ id, name, availableCount, price, orderedQuantity, total, onChangeQuantity }) => {

    const handleIncrement = () => {
        onChangeQuantity(id, +orderedQuantity + 1)
    }

    const handleDecrement = () => {
        onChangeQuantity(id, +orderedQuantity - 1)
    }

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>   
      <td>${roundNumber(total)}</td>
      <td>
        <button className={styles.actionButton} disabled={orderedQuantity === availableCount} onClick={() => handleIncrement()}>+</button>
        <button className={styles.actionButton} disabled={orderedQuantity === 0} onClick={() => handleDecrement()}>-</button>
      </td>
    </tr>    
  );
}


const Checkout = () => {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    let totalPrice = 0;
    let discount = 0;

    const onChangeQuantity = (id, orderedQuantity) => {
        const changedProducts = products.map(product => {
            if (product.id === id) {
                return ({
                    id: product.id,
                    name: product.name,
                    availableCount: product.availableCount,
                    price: product.price,
                    orderedQuantity: orderedQuantity,
                    total: orderedQuantity* product.price
                })
            }
            return product
        });
        setProducts(changedProducts)
    }

    React.useEffect(() => {
        getProducts().then(products => {
            setProducts(products.map(product => {return ({...product, orderedQuantity: 0, total: 0})}))
            setLoading(false);
        }).catch(() => {
                setLoading(false)
        })
    }, [])

    products.forEach(product => totalPrice += product.total)
    if (totalPrice > 1000) {
        discount = totalPrice * 0.1;
    }
  return (
    <div>
      <header className={styles.header}>        
        <h1>Electro World</h1>        
      </header>
      <main>
          {loading && <LoadingIcon /> }
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {products.map(product => {return (
              <Product
                  key={product?.id}
                  name={product?.name}
                  id={product?.id}
                  price={product?.price}
                  availableCount={product?.availableCount}
                  orderedQuantity={product?.orderedQuantity}
                  total={product?.total}
                  onChangeQuantity={(id, orderedQuantity) => onChangeQuantity(id, orderedQuantity)}
              />
            )
          })}
          </tbody>
        </table>
        <h2>Order summary</h2>
          {!!discount && <p>Discount: {roundNumber(discount)}$ </p>}
        <p>Total: {discount ? roundNumber(totalPrice - discount) : roundNumber(totalPrice)}$ </p>
      </main>
    </div>
  );
};

export default Checkout;