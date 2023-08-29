import { useEffect, useState, useRef } from 'react';
import styles from './Category.module.css';
import { useRouter } from 'next/router';

function HomePage() {
  // State to store menu categories and loading status
  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace with your actual API endpoint and token
  const apiUrl = process.env.NEXT_PUBLIC_HOMEPAGE_MENU;
  const token = process.env.NEXT_PUBLIC_TOKEN;

  useEffect(() => {
    // Fetch menu categories
    async function fetchMenuCategories() {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch menu categories");
        }

        const data = await response.json();
        setMenuCategories(data.data);
        console.log('Fetched Menu Categories:', data.data);
      } catch (error) {
        console.error("Error fetching menu categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenuCategories();
  }, [token]);

 

  // Refs to store references to category elements for scrolling
  const categoryRefs = useRef([]);

  const handleCategoryClick = (index) => {
    // Scroll to the clicked category using refs
    categoryRefs.current[index].scrollIntoView({ behavior: 'smooth' });
  };

  const router = useRouter();
  const handleButtonClick = (CategorySlug, slug) => {
    console.log('CategorySlug:', CategorySlug);
    console.log('slug:', slug);
    const targetURL = `/menu/${CategorySlug}/${slug}`;
    console.log('Target URL:', targetURL);
   router.push(targetURL);
  };

  return (
    <div>
      <h1>Menu Categories</h1>
      {loading ? (
        <p>Loading menu categories...</p>
      ) : (
        <div className={styles['card-container']}>
          {menuCategories.length > 0 ? (
            menuCategories.map((category, index) => (
              <div
                key={category.id}
                ref={(ref) => (categoryRefs.current[index] = ref)}
                className={styles['category-card']}
              >
                <div className={styles['category-info']}>
                  <h2 onClick={() => handleCategoryClick(index)}>
                    {category.attributes.Category}
                  </h2>
                </div>

                <div className={styles['field-card-container']}>
                  {category.attributes.CategoryField &&
                    category.attributes.CategoryField.data.map((field) => (
                      <div key={field.id} className={styles['field-card']}>
                        <div className={styles['field-details']}>
                          <img
                            src={field.attributes.Image.data.attributes.url}
                            alt={field.attributes.Title}
                            className={styles['field-image']}
                          />
                          <h3>{field.attributes.Title}</h3>
                          <p>Price: {field.attributes.Price}</p>
                          <p>Calories: {field.attributes.Calories}</p>
                        </div>
                        <button
                          className={styles['order-button']}
                          onClick={() =>
                            handleButtonClick(
                              category.attributes.CategorySlug,
                              field.attributes.slug
                            )
                          }
                        >
                          Choose
                        </button>
                      </div>
                    ))}
                    <br />
                </div>
              </div>
            ))
          ) : (
            <p>No menu categories available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
