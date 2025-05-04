import { useEffect } from "react";
import { Box, VStack, Text } from "@chakra-ui/react";

const productMap = {
  furia: [
    {
      image: "https://furiagg.fbitsstatic.net/img/m/adidas-3103.jpg?v=202504101615&origem=i/Menu/adidas-3103.jpg",
      link: "https://www.furia.gg/produto/camiseta-furia-adidas-preta-150263",
    },
    {
      image: "https://furiagg.fbitsstatic.net/img/m/zor-3098.jpg?v=202503171541&origem=i/Menu/zor-3098.jpg",
      link: "https://www.furia.gg/produto/jaqueta-furia-x-zor-verde-militar-150246",
    },
  ],
  loud: [
    {
      image: "https://loud.gg/cdn/shop/files/1.LOUD-153_1.jpg?v=1717782613&width=1346",
      link: "https://loud.gg/products/uniforme-oficial-loud-2024",
    },
    {
      image: "https://loud.gg/cdn/shop/files/1_3648629a-afff-447f-b421-b240cf4866e8.jpg?v=1710814232&width=1346",
      link: "https://loud.gg/products/cropped-inspire",
    },
  ],
  "pai n": [
    { image: "https://pain.gg/produto1.jpg", link: "https://pain.gg/produto1" },
  ],
  "g2 esports": [
    { image: "https://g2esports.com/produto1.jpg", link: "https://g2esports.com/produto1" },
  ],
};

function getRandomProducts(interests) {
  console.log("Interests received:", interests);
  const validInterests = Array.isArray(interests) ? interests.map(i => i.toLowerCase()) : [];
  console.log("Valid interests:", validInterests);
  const possibleProducts = validInterests
    .filter(team => productMap[team])
    .map(team => ({ team, products: productMap[team] }));

  console.log("Possible products:", possibleProducts);

  if (possibleProducts.length === 0) {
    console.log("No valid products found, returning [null, null]");
    return [null, null];
  }

  if (possibleProducts.length === 1 || possibleProducts[0].products.length >= 2) {
    const teamProducts = possibleProducts[0].products;
    if (teamProducts.length === 1) {
      console.log("Only one product available for team:", possibleProducts[0].team);
      return [teamProducts[0], null];
    }
    const firstProduct = teamProducts[Math.floor(Math.random() * teamProducts.length)];
    const remainingProducts = teamProducts.filter(p => p !== firstProduct);
    const secondProduct = remainingProducts[Math.floor(Math.random() * remainingProducts.length)];
    console.log("Selected products (same team):", { firstProduct, secondProduct });
    return [firstProduct, secondProduct];
  }

  const allProducts = possibleProducts.flatMap(team => team.products);
  if (allProducts.length === 1) {
    console.log("Only one product available across all teams");
    return [allProducts[0], null];
  }
  const firstProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
  const remainingProducts = allProducts.filter(p => p !== firstProduct);
  const secondProduct = remainingProducts[Math.floor(Math.random() * remainingProducts.length)];
  console.log("Selected products (multiple teams):", { firstProduct, secondProduct });
  return [firstProduct, secondProduct];
}

export default function RecommendedProductCard({ interests }) {
  useEffect(() => {
    console.log("RecommendedProductCard rendered with interests:", interests);
  }, [interests]);

  const [product1, product2] = getRandomProducts(interests);

  console.log("Products to render:", { product1, product2 });

  const renderProductCard = (product, index) => {
    if (!product) {
      return (
        <Box
          key={`product-${index}`}
          bg="rgba(0,0,0,0.7)"
          backdropFilter="blur(5px)"
          borderRadius="2xl"
          height="100%"
          minHeight="150px"
          maxHeight="100%"
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          fontWeight="bold"
          transition="all 0.3s ease"
          boxShadow="0 2px 10px rgba(0,0,0,0.9)"
          _hover={{
            transform: "scale(1.02)",
            boxShadow: "0 0 10px #FFD700",
          }}
          p={4}
          textAlign="center"
          boxSizing="border-box"
        >
          <Text fontSize="sm">Nenhum produto disponível</Text>
        </Box>
      );
    }

    return (
      <a
        key={`product-${index}`}
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "block", height: "100%", width: "100%" }}
      >
        <Box
          bgImage={`url(${product.image})`}
          bgSize="cover"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgColor="rgba(0,0,0,0.7)"
          borderRadius="2xl"
          height="100%"
          minHeight="150px"
          maxHeight="100%"
          width="100%"
          transition="all 0.3s ease"
          boxShadow="0 2px 10px rgba(0,0,0,0.9)"
          _hover={{
            transform: "scale(1.02)",
            boxShadow: "0 0 10px #FFD700",
          }}
          position="relative"
          overflow="hidden"
          boxSizing="border-box"
        />
      </a>
    );
  };

  return (
    <VStack spacing={4} height="100%" width="100%" align="stretch">
      {renderProductCard(product1, 0)}
      {renderProductCard(product2, 1)}
    </VStack>
  );
}