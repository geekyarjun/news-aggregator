export interface NewsAPIResponse {
  articles: {
    url: string;
    title: string;
    description: string;
    source: {
      name: string;
    };
    publishedAt: string;
    urlToImage: string;
  }[];
  status: string;
  message: string;
  totalResults: number;
}

export interface GuardianAPIResponse {
  response: {
    results: {
      id: string;
      webTitle: string;
      fields?: {
        trailText: string;
        thumbnail: string;
      };
      sectionName: string;
      webPublicationDate: string;
      webUrl: string;
    }[];
    total: number;
  };
}

export interface NYTAPIResponse {
  results: {
    uri: string;
    title: string;
    abstract: string;
    section: string;
    published_date: string;
    url: string;
    multimedia: {
      url: string;
    }[];
  }[];
  response: {
    docs: {
      _id: string;
      headline: {
        main: string;
      };
      abstract: string;
      lead_paragraph: string;
      section_name: string;
      pub_date: string;
      web_url: string;
      multimedia: {
        url: string;
      }[];
    }[];
    meta: {
      hits: number;
    };
  };
}
