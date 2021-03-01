import React from 'react';
import { UniversalLink } from '@plone/volto/components';
import './styles.less';

export const LinkElement = ({ attributes, children, element, mode }) => {
  // TODO: handle anchor links (#something)

  let url = element.url;
  const { link } = element.data || {};

  const internal_link = link?.internal?.internal_link?.[0]?.['@id'];
  const external_link = link?.external?.external_link;
  const email = link?.email;

  const href = email
    ? `mailto:${email.email_address}${
        email.email_subject ? `?subject=${email.email_subject}` : ''
      }`
    : external_link || internal_link || url;

  const { title } = element?.data || {};
  return mode === 'view' ? (
    <UniversalLink
      href={href}
      openLinkInNewTab={link?.external?.target}
      title={title}
    >
      {children}
    </UniversalLink>
  ) : (
    <span {...attributes} className="slate-editor-link">
      {children}
    </span>
  );

  // const options = {
  //   target: external_link ? link.external.target : null,
  //   href,
  // };
  // return external_link?.startsWith('/') || internal_link ? (
  //   <Link to={external_link || internal_link}>{children}</Link>
  // ) : (
  //   <a {...attributes} {...options} title={title}>
  //     {children}
  //   </a>
  // );
};
