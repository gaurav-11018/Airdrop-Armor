import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { Heading, Spinner, Card, Text } from "@chakra-ui/react";
import "./App.css";
import { pascalStrToSpacedWord } from "./helper";
import Form from "./Form";

function App() {
  const [token, setToken] = useState(null);
  const [schema, setSchema] = useState(null);
  const [schemaLink, setClaimLink] = useState(null);

  useEffect(() => {
    fetch("https://api-staging.polygonid.com/v1/orgs/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "application/json",
      },
      body: JSON.stringify({
        email: import.meta.env.VITE_POLYGON_ID_EMAIL,
        password: import.meta.env.VITE_POLYGON_ID_PASSWORD,
      }),
    })
      .then((response) => response.json())
      .then(({ token }) => {
        setToken(token);
        const {
          account: { organization: issuerId },
        } = jwt_decode(token);

        const tempSchemaLink = `https://api-staging.polygonid.com/v1/issuers/${issuerId}/schemas/${
          import.meta.env.VITE_POLYGON_ID_SCHEMA_ID
        }`;
        setClaimLink(`${tempSchemaLink}/offers`);
        return { token, tempSchemaLink };
      })
      .then(({ token, tempSchemaLink }) => {
        fetch(tempSchemaLink, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept-Encoding": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => setSchema(data));
      });
  }, []);

  const handleResults = (results) => {
    fetch(schemaLink, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        attributes: Object.keys(results).map((k) => {
          const removeDashes = results[k].indexOf("-") !== 0;
          const val = removeDashes
            ? results[k].replaceAll("-", "")
            : results[k];
          return {
            attributeKey: k,
            attributeValue: parseInt(val),
          };
        }),
      }),
    })
      .then((response) => response.json())
      .then(({ id }) => {
        window.open(
          `https://platform-test.polygonid.com/claim-link/4ee71757-9bd1-4e7f-8734-fa10199d45a1`,
          "_newtab"
        );
      });
  };

  return !!schema ? (
    <>
      <Card w="xl" p={10} background="rgba(255,255,255,.90)">
        <Heading mb={5}>Claim {pascalStrToSpacedWord(schema.schema)}</Heading>
        <Form fieldInfo={schema?.attributes} passBackResults={handleResults} />
      </Card>
      <Text m={10} as="sub" className="builtBy">
        Template built by{" "}
        <a href="https://twitter.com/Gaurav28112001" target="_blank">
          Gaurav
        </a>
      </Text>
    </>
  ) : (
    <Spinner size="xl" />
  );
}

export default App;
