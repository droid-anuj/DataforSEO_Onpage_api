import  { useState, } from "react";
import axios from "axios";
import "./DataForSEOWidget.css";

function SeoDetailsForm() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [taskId, setTaskId] = useState(null);
  const [seoData, setSeoData] = useState(null);

  const apiUsername = "anujyadavvvv12345@gmail.com";
  const apiPassword = "242f29e273580741";

  const handleApiRequest = async () => {
    setIsLoading(true);

    try {
      const post_array = [
        {
          target: url,
          max_crawl_pages: 5,
          load_resources: true,
          enable_javascript: true,
          enable_browser_rendering: true,
        },
      ];

      const axiosConfig = {
        headers: {
          Authorization: `Basic ${btoa(`${apiUsername}:${apiPassword}`)}`,
          "Content-Type": "application/json",
        },
      };

      const postResponse = await axios.post(
        "https://api.dataforseo.com/v3/on_page/task_post",
        post_array,
        axiosConfig
      );

      const taskId = postResponse.data.tasks[0].id;
      setTaskId(taskId);

      // Check task status until it's completed
      await checkTaskStatus(taskId);

      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching SEO data:", err);
      setError(
        "An error occurred while fetching SEO data. Please try again later."
      );
      setIsLoading(false);
    }
  };

  const checkTaskStatus = async (taskId) => {
    try {
      const axiosConfig = {
        headers: {
          Authorization: `Basic ${btoa(`${apiUsername}:${apiPassword}`)}`,
          "Content-Type": "application/json",
        },
      };

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const response = await axios.get(
          "https://api.dataforseo.com/v3/on_page/tasks_ready",
          axiosConfig
        );

        if (response.data.tasks && response.data.tasks[0]) {
          const matchingResult = response.data.tasks[0].result.find(
            (task) => task.id === taskId
          );

          if (matchingResult) {
            // Task is completed, you can fetch the SEO data now
            const seoDataResponse = await axios.post(
              "https://api.dataforseo.com/v3/on_page/pages",
              [{ id: taskId, limit: 1 }],
              axiosConfig
            );
            console.log(seoDataResponse.data);
            setSeoData(seoDataResponse.data);
            break;
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    } catch (err) {
      console.error("Error checking task status:", err);
      setError(
        "An error occurred while checking the task status. Please try again later."
      );
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleApiRequest();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {seoData ? (
          <>
            <p>EVERYTHING YOU NEED TO KNOW</p>
            <p>Results for: {url}</p>
          </>
        ) : (
          <>
            <div className="input_area">
              <h1>Let me tell you Something About your Website:</h1>
              <input
                type="text"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button type="submit">Search</button>
            </div>
          </>
        )}
      </form>

      {isLoading && (
        <p>
        <div className="loading_icon">
          <div className="content">
            <div className="circle"> </div>
            <div className="circle"> </div>
            <div className="circle"> </div>
            <div className="circle"> </div>
          </div>
          </div>
        </p>
      )}
      {error && <p>{error}</p>}

      {seoData && (
        <div>
          <div className="border_for_div">
            <h2>Onpage results</h2>

            {seoData.tasks[0].result[0].items[0].onpage_score && (
              <p>
                Onpage score: {seoData.tasks[0].result[0].items[0].onpage_score}
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.content
              .plain_text_rate && (
              <p>
                Plain Text Rate:{" "}
                {
                  seoData.tasks[0].result[0].items[0].meta.content
                    .plain_text_rate
                }
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.content
              .plain_text_size && (
              <p>
                Plain text Size:{" "}
                {
                  seoData.tasks[0].result[0].items[0].meta.content
                    .plain_text_size
                }
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.content
              .plain_text_word_count && (
              <p>
                Plain Text Word count :{" "}
                {
                  seoData.tasks[0].result[0].items[0].meta.content
                    .plain_text_word_count
                }
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.inbound_links_count && (
              <p>
                Inbound Links:{" "}
                {seoData.tasks[0].result[0].items[0].meta.inbound_links_count}
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.external_links_count && (
              <p>
                External Links:{" "}
                {seoData.tasks[0].result[0].items[0].meta.external_links_count}
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.internal_links_count && (
              <p>
                Internal Links:{" "}
                {seoData.tasks[0].result[0].items[0].meta.internal_links_count}
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.scripts_count && (
              <p>
                Scripts:{" "}
                {seoData.tasks[0].result[0].items[0].meta.scripts_count}
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.scripts_size && (
              <p>
                Scripts Size :{" "}
                {seoData.tasks[0].result[0].items[0].meta.scripts_size}
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.images_count && (
              <p>
                Images : {seoData.tasks[0].result[0].items[0].meta.images_count}
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.content
              .meta_keywords_to_content_consistency && (
              <p>
                Meta Keywords To Content Consistency:{" "}
                {
                  seoData.tasks[0].result[0].items[0].meta.content
                    .meta_keywords_to_content_consistency
                }
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.content
              .description_to_content_consistency && (
              <p>
                Description To Content Consistency:{" "}
                {
                  seoData.tasks[0].result[0].items[0].meta.content
                    .description_to_content_consistency
                }
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.content
              .flesch_kincaid_readability_index && (
              <p>
                Flesch Kincaid Readability Index:{" "}
                {
                  seoData.tasks[0].result[0].items[0].meta.content
                    .flesch_kincaid_readability_index
                }
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.content
              .automated_readability_index && (
              <p>
                Automated Readability Index:{" "}
                {
                  seoData.tasks[0].result[0].items[0].meta.content
                    .automated_readability_index
                }
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.content
              .coleman_liau_readability_index && (
              <p>
                Coleman Liau Readability Index:{" "}
                {
                  seoData.tasks[0].result[0].items[0].meta.content
                    .coleman_liau_readability_index
                }
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.content
              .dale_chall_readability_index && (
              <p>
                Dale Chall Readability Index:{" "}
                {
                  seoData.tasks[0].result[0].items[0].meta.content
                    .dale_chall_readability_index
                }
              </p>
            )}
            {seoData.tasks[0].result[0].items[0].meta.content
              .smog_readability_index && (
              <p>
                Smog Readability Index:{" "}
                {
                  seoData.tasks[0].result[0].items[0].meta.content
                    .smog_readability_index
                }
              </p>
            )}
          </div>
          <divc className="border_for_div">
            <h2>Checks</h2>
            {seoData.tasks[0].result[0].items[0].checks && (
              <div className="border_for_div">
                <p>
                  Canonical:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.canonical
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Canonical Chain:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.canonical_chain
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Canonical to Broken:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .canonical_to_broken
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Canonical to Redirect:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .canonical_to_redirect
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Deprecated HTML Tags:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .deprecated_html_tags
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Duplicate Meta Tags:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .duplicate_meta_tags
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Duplicate Title Tag:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .duplicate_title_tag
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Flash:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.flash
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Frame:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.frame
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Has HTML Doctype:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.has_html_doctype
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Has Links to Redirects:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .has_links_to_redirects
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Has Meta Refresh Redirect:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .has_meta_refresh_redirect
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Has Meta Title:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.has_meta_title
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Has Micro Markup:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.has_micromarkup
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Has Micro Markup Errors:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .has_micromarkup_errors
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Has Render Blocking Resources:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .has_render_blocking_resources
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  High Character Count:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .high_character_count
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  High Content Rate:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.high_content_rate
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  High Loading Time:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.high_loading_time
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  High Waiting Time:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.high_waiting_time
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  HTTPS to HTTP Links:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .https_to_http_links
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Irrelevant Description:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .irrelevant_description
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Irrelevant Meta Keywords:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .irrelevant_meta_keywords
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Irrelevant Title:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.irrelevant_title
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Is 4xx Code:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.is_4xx_code
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Is 5xx Code:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.is_5xx_code
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Is Broken:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.is_broken
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Is HTTP:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.is_http
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Is HTTPS:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.is_https
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Is Link Relation Conflict:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .is_link_relation_conflict
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Is Orphan Page:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.is_orphan_page
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Is Redirect:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.is_redirect
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Is www:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.is_www
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Large Page Size:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.large_page_size
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Lorem Ipsum:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.lorem_ipsum
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Low Character Count:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .low_character_count
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Low Content Rate:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.low_content_rate
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Low Readability Rate:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .low_readability_rate
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Meta Charset Consistency:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .meta_charset_consistency
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  No Content Encoding:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .no_content_encoding
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  No Description:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.no_description
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  No Doctype:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.no_doctype
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  No Encoding Meta Tag:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .no_encoding_meta_tag
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  No Favicon:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.no_favicon
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  No H1 Tag:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.no_h1_tag
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  No Image Alt:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.no_image_alt
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  No Image Title:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.no_image_title
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  No Title:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.no_title
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Recursive Canonical:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .recursive_canonical
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Redirect Chain:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.redirect_chain
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  SEO Friendly URL:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.seo_friendly_url
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  SEO Friendly URL Characters Check:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .seo_friendly_url_characters_check
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  SEO Friendly URL Dynamic Check:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .seo_friendly_url_dynamic_check
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  SEO Friendly URL Keywords Check:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .seo_friendly_url_keywords_check
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  SEO Friendly URL Relative Length Check:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .seo_friendly_url_relative_length_check
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Size Greater Than 3MB:{" "}
                  {seoData.tasks[0].result[0].items[0].checks
                    .size_greater_than_3mb
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Small Page Size:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.small_page_size
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Title Too Long:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.title_too_long
                    ? "✔️"
                    : "❌"}
                </p>
                <p>
                  Title Too Short:{" "}
                  {seoData.tasks[0].result[0].items[0].checks.title_too_short
                    ? "✔️"
                    : "❌"}
                </p>
              </div>
            )}
          </divc>
          <div className="border_for_div">
            <h2>H Tags</h2>
            {seoData.tasks[0].result[0].items[0].meta.htags.h1 && (
              <div>
                <h2>h1 Tags</h2>

                <ol>
                  {seoData.tasks[0].result[0].items[0].meta.htags.h1.map(
                    (tag, index) => (
                      <li key={index}>{tag}</li>
                    )
                  )}
                </ol>
              </div>
            )}
            {seoData.tasks[0].result[0].items[0].meta.htags.h2 && (
              <div>
                <h2>h2 Tags</h2>

                <ol>
                  {seoData.tasks[0].result[0].items[0].meta.htags.h2.map(
                    (tag, index) => (
                      <li key={index}>{tag}</li>
                    )
                  )}
                </ol>
              </div>
            )}
            {seoData.tasks[0].result[0].items[0].meta.htags.h3 && (
              <div>
                <h2>h2 Tags</h2>

                <ol>
                  {seoData.tasks[0].result[0].items[0].meta.htags.h3.map(
                    (tag, index) => (
                      <li key={index}>{tag}</li>
                    )
                  )}
                </ol>
              </div>
            )}
            {seoData.tasks[0].result[0].items[0].meta.htags.h4 && (
              <div>
                <h2>h2 Tags</h2>

                <ol>
                  {seoData.tasks[0].result[0].items[0].meta.htags.h4.map(
                    (tag, index) => (
                      <li key={index}>{tag}</li>
                    )
                  )}
                </ol>
              </div>
            )}
            {seoData.tasks[0].result[0].items[0].meta.htags.h5 && (
              <div>
                <h2>h2 Tags</h2>

                <ol>
                  {seoData.tasks[0].result[0].items[0].meta.htags.h5.map(
                    (tag, index) => (
                      <li key={index}>{tag}</li>
                    )
                  )}
                </ol>
              </div>
            )}
            {seoData.tasks[0].result[0].items[0].meta.htags.h6 && (
              <div>
                <h2>h2 Tags</h2>

                <ol>
                  {seoData.tasks[0].result[0].items[0].meta.htags.h6.map(
                    (tag, index) => (
                      <li key={index}>{tag}</li>
                    )
                  )}
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SeoDetailsForm;
