/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  Lexicons,
  ValidationError,
  type LexiconDoc,
  type ValidationResult,
} from '@atproto/lexicon'

import { is$typed, maybe$typed } from './util.js'

export const schemaDict = {
  XyzStatusphereDefs: {
    lexicon: 1,
    id: 'xyz.statusphere.defs',
    defs: {
      statusView: {
        type: 'object',
        required: ['uri', 'status', 'profile', 'createdAt'],
        properties: {
          uri: {
            type: 'string',
            format: 'at-uri',
          },
          status: {
            type: 'string',
            minLength: 1,
            maxGraphemes: 1,
            maxLength: 32,
          },
          createdAt: {
            type: 'string',
            format: 'datetime',
          },
          profile: {
            type: 'ref',
            ref: 'lex:xyz.statusphere.defs#profileView',
          },
        },
      },
      profileView: {
        type: 'object',
        required: ['did', 'handle'],
        properties: {
          did: {
            type: 'string',
            format: 'did',
          },
          handle: {
            type: 'string',
            format: 'handle',
          },
        },
      },
    },
  },
  XyzStatusphereGetStatuses: {
    lexicon: 1,
    id: 'xyz.statusphere.getStatuses',
    defs: {
      main: {
        type: 'query',
        description: 'Get a list of the most recent statuses on the network.',
        parameters: {
          type: 'params',
          properties: {
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 50,
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['statuses'],
            properties: {
              statuses: {
                type: 'array',
                items: {
                  type: 'ref',
                  ref: 'lex:xyz.statusphere.defs#statusView',
                },
              },
            },
          },
        },
      },
    },
  },
  XyzStatusphereGetUser: {
    lexicon: 1,
    id: 'xyz.statusphere.getUser',
    defs: {
      main: {
        type: 'query',
        description: "Get the current user's profile and status.",
        parameters: {
          type: 'params',
          properties: {},
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['profile'],
            properties: {
              profile: {
                type: 'ref',
                ref: 'lex:app.bsky.actor.defs#profileView',
              },
              status: {
                type: 'ref',
                ref: 'lex:xyz.statusphere.defs#statusView',
              },
            },
          },
        },
      },
    },
  },
  XyzStatusphereSendStatus: {
    lexicon: 1,
    id: 'xyz.statusphere.sendStatus',
    defs: {
      main: {
        type: 'procedure',
        description: 'Send a status into the ATmosphere.',
        input: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['status'],
            properties: {
              status: {
                type: 'string',
                minLength: 1,
                maxGraphemes: 1,
                maxLength: 32,
              },
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['status'],
            properties: {
              status: {
                type: 'ref',
                ref: 'lex:xyz.statusphere.defs#statusView',
              },
            },
          },
        },
      },
    },
  },
  XyzStatusphereStatus: {
    lexicon: 1,
    id: 'xyz.statusphere.status',
    defs: {
      main: {
        type: 'record',
        key: 'tid',
        record: {
          type: 'object',
          required: ['status', 'createdAt'],
          properties: {
            status: {
              type: 'string',
              minLength: 1,
              maxGraphemes: 1,
              maxLength: 32,
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
          },
        },
      },
    },
  },
  ComAtprotoLabelDefs: {
    lexicon: 1,
    id: 'com.atproto.label.defs',
    defs: {
      label: {
        type: 'object',
        description:
          'Metadata tag on an atproto resource (eg, repo or record).',
        required: ['src', 'uri', 'val', 'cts'],
        properties: {
          ver: {
            type: 'integer',
            description: 'The AT Protocol version of the label object.',
          },
          src: {
            type: 'string',
            format: 'did',
            description: 'DID of the actor who created this label.',
          },
          uri: {
            type: 'string',
            format: 'uri',
            description:
              'AT URI of the record, repository (account), or other resource that this label applies to.',
          },
          cid: {
            type: 'string',
            format: 'cid',
            description:
              "Optionally, CID specifying the specific version of 'uri' resource this label applies to.",
          },
          val: {
            type: 'string',
            maxLength: 128,
            description:
              'The short string name of the value or type of this label.',
          },
          neg: {
            type: 'boolean',
            description:
              'If true, this is a negation label, overwriting a previous label.',
          },
          cts: {
            type: 'string',
            format: 'datetime',
            description: 'Timestamp when this label was created.',
          },
          exp: {
            type: 'string',
            format: 'datetime',
            description:
              'Timestamp at which this label expires (no longer applies).',
          },
          sig: {
            type: 'bytes',
            description: 'Signature of dag-cbor encoded label.',
          },
        },
      },
      selfLabels: {
        type: 'object',
        description:
          'Metadata tags on an atproto record, published by the author within the record.',
        required: ['values'],
        properties: {
          values: {
            type: 'array',
            items: {
              type: 'ref',
              ref: 'lex:com.atproto.label.defs#selfLabel',
            },
            maxLength: 10,
          },
        },
      },
      selfLabel: {
        type: 'object',
        description:
          'Metadata tag on an atproto record, published by the author within the record. Note that schemas should use #selfLabels, not #selfLabel.',
        required: ['val'],
        properties: {
          val: {
            type: 'string',
            maxLength: 128,
            description:
              'The short string name of the value or type of this label.',
          },
        },
      },
      labelValueDefinition: {
        type: 'object',
        description:
          'Declares a label value and its expected interpretations and behaviors.',
        required: ['identifier', 'severity', 'blurs', 'locales'],
        properties: {
          identifier: {
            type: 'string',
            description:
              "The value of the label being defined. Must only include lowercase ascii and the '-' character ([a-z-]+).",
            maxLength: 100,
            maxGraphemes: 100,
          },
          severity: {
            type: 'string',
            description:
              "How should a client visually convey this label? 'inform' means neutral and informational; 'alert' means negative and warning; 'none' means show nothing.",
            knownValues: ['inform', 'alert', 'none'],
          },
          blurs: {
            type: 'string',
            description:
              "What should this label hide in the UI, if applied? 'content' hides all of the target; 'media' hides the images/video/audio; 'none' hides nothing.",
            knownValues: ['content', 'media', 'none'],
          },
          defaultSetting: {
            type: 'string',
            description: 'The default setting for this label.',
            knownValues: ['ignore', 'warn', 'hide'],
            default: 'warn',
          },
          adultOnly: {
            type: 'boolean',
            description:
              'Does the user need to have adult content enabled in order to configure this label?',
          },
          locales: {
            type: 'array',
            items: {
              type: 'ref',
              ref: 'lex:com.atproto.label.defs#labelValueDefinitionStrings',
            },
          },
        },
      },
      labelValueDefinitionStrings: {
        type: 'object',
        description:
          'Strings which describe the label in the UI, localized into a specific language.',
        required: ['lang', 'name', 'description'],
        properties: {
          lang: {
            type: 'string',
            description:
              'The code of the language these strings are written in.',
            format: 'language',
          },
          name: {
            type: 'string',
            description: 'A short human-readable name for the label.',
            maxGraphemes: 64,
            maxLength: 640,
          },
          description: {
            type: 'string',
            description:
              'A longer description of what the label means and why it might be applied.',
            maxGraphemes: 10000,
            maxLength: 100000,
          },
        },
      },
      labelValue: {
        type: 'string',
        knownValues: [
          '!hide',
          '!no-promote',
          '!warn',
          '!no-unauthenticated',
          'dmca-violation',
          'doxxing',
          'porn',
          'sexual',
          'nudity',
          'nsfl',
          'gore',
        ],
      },
    },
  },
  ComAtprotoRepoApplyWrites: {
    lexicon: 1,
    id: 'com.atproto.repo.applyWrites',
    defs: {
      main: {
        type: 'procedure',
        description:
          'Apply a batch transaction of repository creates, updates, and deletes. Requires auth, implemented by PDS.',
        input: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['repo', 'writes'],
            properties: {
              repo: {
                type: 'string',
                format: 'at-identifier',
                description:
                  'The handle or DID of the repo (aka, current account).',
              },
              validate: {
                type: 'boolean',
                description:
                  "Can be set to 'false' to skip Lexicon schema validation of record data across all operations, 'true' to require it, or leave unset to validate only for known Lexicons.",
              },
              writes: {
                type: 'array',
                items: {
                  type: 'union',
                  refs: [
                    'lex:com.atproto.repo.applyWrites#create',
                    'lex:com.atproto.repo.applyWrites#update',
                    'lex:com.atproto.repo.applyWrites#delete',
                  ],
                  closed: true,
                },
              },
              swapCommit: {
                type: 'string',
                description:
                  'If provided, the entire operation will fail if the current repo commit CID does not match this value. Used to prevent conflicting repo mutations.',
                format: 'cid',
              },
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: [],
            properties: {
              commit: {
                type: 'ref',
                ref: 'lex:com.atproto.repo.defs#commitMeta',
              },
              results: {
                type: 'array',
                items: {
                  type: 'union',
                  refs: [
                    'lex:com.atproto.repo.applyWrites#createResult',
                    'lex:com.atproto.repo.applyWrites#updateResult',
                    'lex:com.atproto.repo.applyWrites#deleteResult',
                  ],
                  closed: true,
                },
              },
            },
          },
        },
        errors: [
          {
            name: 'InvalidSwap',
            description:
              "Indicates that the 'swapCommit' parameter did not match current commit.",
          },
        ],
      },
      create: {
        type: 'object',
        description: 'Operation which creates a new record.',
        required: ['collection', 'value'],
        properties: {
          collection: {
            type: 'string',
            format: 'nsid',
          },
          rkey: {
            type: 'string',
            maxLength: 512,
            format: 'record-key',
            description:
              'NOTE: maxLength is redundant with record-key format. Keeping it temporarily to ensure backwards compatibility.',
          },
          value: {
            type: 'unknown',
          },
        },
      },
      update: {
        type: 'object',
        description: 'Operation which updates an existing record.',
        required: ['collection', 'rkey', 'value'],
        properties: {
          collection: {
            type: 'string',
            format: 'nsid',
          },
          rkey: {
            type: 'string',
            format: 'record-key',
          },
          value: {
            type: 'unknown',
          },
        },
      },
      delete: {
        type: 'object',
        description: 'Operation which deletes an existing record.',
        required: ['collection', 'rkey'],
        properties: {
          collection: {
            type: 'string',
            format: 'nsid',
          },
          rkey: {
            type: 'string',
            format: 'record-key',
          },
        },
      },
      createResult: {
        type: 'object',
        required: ['uri', 'cid'],
        properties: {
          uri: {
            type: 'string',
            format: 'at-uri',
          },
          cid: {
            type: 'string',
            format: 'cid',
          },
          validationStatus: {
            type: 'string',
            knownValues: ['valid', 'unknown'],
          },
        },
      },
      updateResult: {
        type: 'object',
        required: ['uri', 'cid'],
        properties: {
          uri: {
            type: 'string',
            format: 'at-uri',
          },
          cid: {
            type: 'string',
            format: 'cid',
          },
          validationStatus: {
            type: 'string',
            knownValues: ['valid', 'unknown'],
          },
        },
      },
      deleteResult: {
        type: 'object',
        required: [],
        properties: {},
      },
    },
  },
  ComAtprotoRepoCreateRecord: {
    lexicon: 1,
    id: 'com.atproto.repo.createRecord',
    defs: {
      main: {
        type: 'procedure',
        description:
          'Create a single new repository record. Requires auth, implemented by PDS.',
        input: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['repo', 'collection', 'record'],
            properties: {
              repo: {
                type: 'string',
                format: 'at-identifier',
                description:
                  'The handle or DID of the repo (aka, current account).',
              },
              collection: {
                type: 'string',
                format: 'nsid',
                description: 'The NSID of the record collection.',
              },
              rkey: {
                type: 'string',
                format: 'record-key',
                description: 'The Record Key.',
                maxLength: 512,
              },
              validate: {
                type: 'boolean',
                description:
                  "Can be set to 'false' to skip Lexicon schema validation of record data, 'true' to require it, or leave unset to validate only for known Lexicons.",
              },
              record: {
                type: 'unknown',
                description: 'The record itself. Must contain a $type field.',
              },
              swapCommit: {
                type: 'string',
                format: 'cid',
                description:
                  'Compare and swap with the previous commit by CID.',
              },
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['uri', 'cid'],
            properties: {
              uri: {
                type: 'string',
                format: 'at-uri',
              },
              cid: {
                type: 'string',
                format: 'cid',
              },
              commit: {
                type: 'ref',
                ref: 'lex:com.atproto.repo.defs#commitMeta',
              },
              validationStatus: {
                type: 'string',
                knownValues: ['valid', 'unknown'],
              },
            },
          },
        },
        errors: [
          {
            name: 'InvalidSwap',
            description:
              "Indicates that 'swapCommit' didn't match current repo commit.",
          },
        ],
      },
    },
  },
  ComAtprotoRepoDefs: {
    lexicon: 1,
    id: 'com.atproto.repo.defs',
    defs: {
      commitMeta: {
        type: 'object',
        required: ['cid', 'rev'],
        properties: {
          cid: {
            type: 'string',
            format: 'cid',
          },
          rev: {
            type: 'string',
            format: 'tid',
          },
        },
      },
    },
  },
  ComAtprotoRepoDeleteRecord: {
    lexicon: 1,
    id: 'com.atproto.repo.deleteRecord',
    defs: {
      main: {
        type: 'procedure',
        description:
          "Delete a repository record, or ensure it doesn't exist. Requires auth, implemented by PDS.",
        input: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['repo', 'collection', 'rkey'],
            properties: {
              repo: {
                type: 'string',
                format: 'at-identifier',
                description:
                  'The handle or DID of the repo (aka, current account).',
              },
              collection: {
                type: 'string',
                format: 'nsid',
                description: 'The NSID of the record collection.',
              },
              rkey: {
                type: 'string',
                format: 'record-key',
                description: 'The Record Key.',
              },
              swapRecord: {
                type: 'string',
                format: 'cid',
                description:
                  'Compare and swap with the previous record by CID.',
              },
              swapCommit: {
                type: 'string',
                format: 'cid',
                description:
                  'Compare and swap with the previous commit by CID.',
              },
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            properties: {
              commit: {
                type: 'ref',
                ref: 'lex:com.atproto.repo.defs#commitMeta',
              },
            },
          },
        },
        errors: [
          {
            name: 'InvalidSwap',
          },
        ],
      },
    },
  },
  ComAtprotoRepoDescribeRepo: {
    lexicon: 1,
    id: 'com.atproto.repo.describeRepo',
    defs: {
      main: {
        type: 'query',
        description:
          'Get information about an account and repository, including the list of collections. Does not require auth.',
        parameters: {
          type: 'params',
          required: ['repo'],
          properties: {
            repo: {
              type: 'string',
              format: 'at-identifier',
              description: 'The handle or DID of the repo.',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: [
              'handle',
              'did',
              'didDoc',
              'collections',
              'handleIsCorrect',
            ],
            properties: {
              handle: {
                type: 'string',
                format: 'handle',
              },
              did: {
                type: 'string',
                format: 'did',
              },
              didDoc: {
                type: 'unknown',
                description: 'The complete DID document for this account.',
              },
              collections: {
                type: 'array',
                description:
                  'List of all the collections (NSIDs) for which this repo contains at least one record.',
                items: {
                  type: 'string',
                  format: 'nsid',
                },
              },
              handleIsCorrect: {
                type: 'boolean',
                description:
                  'Indicates if handle is currently valid (resolves bi-directionally)',
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoRepoGetRecord: {
    lexicon: 1,
    id: 'com.atproto.repo.getRecord',
    defs: {
      main: {
        type: 'query',
        description:
          'Get a single record from a repository. Does not require auth.',
        parameters: {
          type: 'params',
          required: ['repo', 'collection', 'rkey'],
          properties: {
            repo: {
              type: 'string',
              format: 'at-identifier',
              description: 'The handle or DID of the repo.',
            },
            collection: {
              type: 'string',
              format: 'nsid',
              description: 'The NSID of the record collection.',
            },
            rkey: {
              type: 'string',
              description: 'The Record Key.',
              format: 'record-key',
            },
            cid: {
              type: 'string',
              format: 'cid',
              description:
                'The CID of the version of the record. If not specified, then return the most recent version.',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['uri', 'value'],
            properties: {
              uri: {
                type: 'string',
                format: 'at-uri',
              },
              cid: {
                type: 'string',
                format: 'cid',
              },
              value: {
                type: 'unknown',
              },
            },
          },
        },
        errors: [
          {
            name: 'RecordNotFound',
          },
        ],
      },
    },
  },
  ComAtprotoRepoImportRepo: {
    lexicon: 1,
    id: 'com.atproto.repo.importRepo',
    defs: {
      main: {
        type: 'procedure',
        description:
          'Import a repo in the form of a CAR file. Requires Content-Length HTTP header to be set.',
        input: {
          encoding: 'application/vnd.ipld.car',
        },
      },
    },
  },
  ComAtprotoRepoListMissingBlobs: {
    lexicon: 1,
    id: 'com.atproto.repo.listMissingBlobs',
    defs: {
      main: {
        type: 'query',
        description:
          'Returns a list of missing blobs for the requesting account. Intended to be used in the account migration flow.',
        parameters: {
          type: 'params',
          properties: {
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 1000,
              default: 500,
            },
            cursor: {
              type: 'string',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['blobs'],
            properties: {
              cursor: {
                type: 'string',
              },
              blobs: {
                type: 'array',
                items: {
                  type: 'ref',
                  ref: 'lex:com.atproto.repo.listMissingBlobs#recordBlob',
                },
              },
            },
          },
        },
      },
      recordBlob: {
        type: 'object',
        required: ['cid', 'recordUri'],
        properties: {
          cid: {
            type: 'string',
            format: 'cid',
          },
          recordUri: {
            type: 'string',
            format: 'at-uri',
          },
        },
      },
    },
  },
  ComAtprotoRepoListRecords: {
    lexicon: 1,
    id: 'com.atproto.repo.listRecords',
    defs: {
      main: {
        type: 'query',
        description:
          'List a range of records in a repository, matching a specific collection. Does not require auth.',
        parameters: {
          type: 'params',
          required: ['repo', 'collection'],
          properties: {
            repo: {
              type: 'string',
              format: 'at-identifier',
              description: 'The handle or DID of the repo.',
            },
            collection: {
              type: 'string',
              format: 'nsid',
              description: 'The NSID of the record type.',
            },
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 50,
              description: 'The number of records to return.',
            },
            cursor: {
              type: 'string',
            },
            rkeyStart: {
              type: 'string',
              description:
                'DEPRECATED: The lowest sort-ordered rkey to start from (exclusive)',
            },
            rkeyEnd: {
              type: 'string',
              description:
                'DEPRECATED: The highest sort-ordered rkey to stop at (exclusive)',
            },
            reverse: {
              type: 'boolean',
              description: 'Flag to reverse the order of the returned records.',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['records'],
            properties: {
              cursor: {
                type: 'string',
              },
              records: {
                type: 'array',
                items: {
                  type: 'ref',
                  ref: 'lex:com.atproto.repo.listRecords#record',
                },
              },
            },
          },
        },
      },
      record: {
        type: 'object',
        required: ['uri', 'cid', 'value'],
        properties: {
          uri: {
            type: 'string',
            format: 'at-uri',
          },
          cid: {
            type: 'string',
            format: 'cid',
          },
          value: {
            type: 'unknown',
          },
        },
      },
    },
  },
  ComAtprotoRepoPutRecord: {
    lexicon: 1,
    id: 'com.atproto.repo.putRecord',
    defs: {
      main: {
        type: 'procedure',
        description:
          'Write a repository record, creating or updating it as needed. Requires auth, implemented by PDS.',
        input: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['repo', 'collection', 'rkey', 'record'],
            nullable: ['swapRecord'],
            properties: {
              repo: {
                type: 'string',
                format: 'at-identifier',
                description:
                  'The handle or DID of the repo (aka, current account).',
              },
              collection: {
                type: 'string',
                format: 'nsid',
                description: 'The NSID of the record collection.',
              },
              rkey: {
                type: 'string',
                format: 'record-key',
                description: 'The Record Key.',
                maxLength: 512,
              },
              validate: {
                type: 'boolean',
                description:
                  "Can be set to 'false' to skip Lexicon schema validation of record data, 'true' to require it, or leave unset to validate only for known Lexicons.",
              },
              record: {
                type: 'unknown',
                description: 'The record to write.',
              },
              swapRecord: {
                type: 'string',
                format: 'cid',
                description:
                  'Compare and swap with the previous record by CID. WARNING: nullable and optional field; may cause problems with golang implementation',
              },
              swapCommit: {
                type: 'string',
                format: 'cid',
                description:
                  'Compare and swap with the previous commit by CID.',
              },
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['uri', 'cid'],
            properties: {
              uri: {
                type: 'string',
                format: 'at-uri',
              },
              cid: {
                type: 'string',
                format: 'cid',
              },
              commit: {
                type: 'ref',
                ref: 'lex:com.atproto.repo.defs#commitMeta',
              },
              validationStatus: {
                type: 'string',
                knownValues: ['valid', 'unknown'],
              },
            },
          },
        },
        errors: [
          {
            name: 'InvalidSwap',
          },
        ],
      },
    },
  },
  ComAtprotoRepoStrongRef: {
    lexicon: 1,
    id: 'com.atproto.repo.strongRef',
    description: 'A URI with a content-hash fingerprint.',
    defs: {
      main: {
        type: 'object',
        required: ['uri', 'cid'],
        properties: {
          uri: {
            type: 'string',
            format: 'at-uri',
          },
          cid: {
            type: 'string',
            format: 'cid',
          },
        },
      },
    },
  },
  ComAtprotoRepoUploadBlob: {
    lexicon: 1,
    id: 'com.atproto.repo.uploadBlob',
    defs: {
      main: {
        type: 'procedure',
        description:
          'Upload a new blob, to be referenced from a repository record. The blob will be deleted if it is not referenced within a time window (eg, minutes). Blob restrictions (mimetype, size, etc) are enforced when the reference is created. Requires auth, implemented by PDS.',
        input: {
          encoding: '*/*',
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['blob'],
            properties: {
              blob: {
                type: 'blob',
              },
            },
          },
        },
      },
    },
  },
  ComWhtwndBlogDefs: {
    lexicon: 1,
    id: 'com.whtwnd.blog.defs',
    defs: {
      blogEntry: {
        type: 'object',
        required: ['content'],
        properties: {
          content: {
            type: 'string',
            maxLength: 100000,
          },
          createdAt: {
            type: 'string',
            format: 'datetime',
          },
        },
      },
      comment: {
        type: 'object',
        required: ['content', 'entryUri'],
        properties: {
          content: {
            type: 'string',
            maxLength: 1000,
          },
          entryUri: {
            type: 'string',
            format: 'at-uri',
          },
        },
      },
      ogp: {
        type: 'object',
        required: ['url'],
        properties: {
          url: {
            type: 'string',
            format: 'uri',
          },
        },
      },
      blobMetadata: {
        type: 'object',
        required: ['blobref'],
        properties: {
          blobref: {
            type: 'blob',
            accept: [
              'image/png',
              'image/jpeg',
              'image/gif',
              'image/webp',
              'image/avif',
              'image/heic',
              'image/heif',
            ],
            maxSize: 1000000,
          },
          encoding: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
        },
      },
    },
  },
  ComWhtwndBlogEntry: {
    lexicon: 1,
    id: 'com.whtwnd.blog.entry',
    defs: {
      main: {
        type: 'record',
        description: 'A declaration of a post.',
        key: 'tid',
        record: {
          type: 'object',
          required: ['content'],
          properties: {
            content: {
              type: 'string',
              maxLength: 100000,
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
            title: {
              type: 'string',
              maxLength: 1000,
            },
            subtitle: {
              type: 'string',
              maxLength: 1000,
            },
            ogp: {
              type: 'ref',
              ref: 'lex:com.whtwnd.blog.defs#ogp',
            },
            theme: {
              type: 'string',
              enum: ['github-light'],
            },
            blobs: {
              type: 'array',
              items: {
                type: 'ref',
                ref: 'lex:com.whtwnd.blog.defs#blobMetadata',
              },
            },
            isDraft: {
              type: 'boolean',
              description:
                '(DEPRECATED) Marks this entry as draft to tell AppViews not to show it to anyone except for the author',
            },
            visibility: {
              type: 'string',
              enum: ['public', 'url', 'author'],
              default: 'public',
              description: 'Tells the visibility of the article to AppView.',
            },
          },
        },
      },
    },
  },
  ComWhtwndBlogGetAuthorPosts: {
    lexicon: 1,
    id: 'com.whtwnd.blog.getAuthorPosts',
    defs: {
      main: {
        type: 'query',
        description: 'Get blog posts associated to designated author.',
        parameters: {
          type: 'params',
          required: ['author'],
          properties: {
            author: {
              type: 'string',
              format: 'did',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['post'],
            properties: {
              post: {
                type: 'array',
                items: {
                  type: 'ref',
                  ref: 'lex:com.whtwnd.blog.defs#blogEntry',
                },
              },
            },
          },
        },
      },
    },
  },
  ComWhtwndBlogGetEntryMetadataByName: {
    lexicon: 1,
    id: 'com.whtwnd.blog.getEntryMetadataByName',
    defs: {
      main: {
        type: 'query',
        description:
          'Get AT URI by blog author and entry name. If there are multiple blog entries associated with the name, return the latest one.',
        parameters: {
          type: 'params',
          required: ['author', 'entryTitle'],
          properties: {
            author: {
              type: 'string',
              format: 'at-identifier',
            },
            entryTitle: {
              type: 'string',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['entryUri'],
            properties: {
              entryUri: {
                type: 'string',
                format: 'at-uri',
              },
              lastUpdate: {
                type: 'string',
                format: 'datetime',
              },
              cid: {
                type: 'string',
                format: 'cid',
              },
            },
          },
        },
        errors: [
          {
            name: 'NotFound',
            description:
              "If the associated name isn't registered in the author's repo, this error is returned",
          },
        ],
      },
    },
  },
  ComWhtwndBlogGetMentionsByEntry: {
    lexicon: 1,
    id: 'com.whtwnd.blog.getMentionsByEntry',
    defs: {
      main: {
        type: 'query',
        description: 'Get comments associated to designated post.',
        parameters: {
          type: 'params',
          required: ['postUri'],
          properties: {
            postUri: {
              type: 'string',
              format: 'at-uri',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['mentions'],
            properties: {
              mentions: {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'at-uri',
                },
              },
            },
          },
        },
      },
    },
  },
  ComWhtwndBlogNotifyOfNewEntry: {
    lexicon: 1,
    id: 'com.whtwnd.blog.notifyOfNewEntry',
    defs: {
      main: {
        type: 'procedure',
        description:
          'Notify AppView of existence of new entry and request indexing',
        input: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['entryUri'],
            properties: {
              entryUri: {
                type: 'string',
                format: 'at-uri',
              },
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: [],
            properties: {},
          },
        },
        errors: [],
      },
    },
  },
  SpaceSwshFeedDefs: {
    lexicon: 1,
    id: 'space.swsh.feed.defs',
    defs: {
      entryView: {
        type: 'object',
        required: ['content', 'author', 'rkey'],
        properties: {
          title: {
            type: 'string',
            maxLength: 1000,
          },
          subtitle: {
            type: 'string',
            maxLength: 1000,
          },
          content: {
            type: 'string',
            maxLength: 100000,
          },
          createdAt: {
            type: 'string',
            format: 'datetime',
          },
          author: {
            type: 'object',
            required: ['did'],
            properties: {
              did: {
                type: 'string',
                format: 'did',
              },
              handle: {
                type: 'string',
              },
            },
          },
          rkey: {
            type: 'string',
          },
          uri: {
            type: 'string',
            format: 'at-uri',
          },
        },
      },
      reply: {
        type: 'object',
        required: ['content', 'createdAt'],
        properties: {
          content: {
            type: 'string',
            maxLength: 1000,
          },
          reply: {
            type: 'ref',
            ref: 'lex:space.swsh.feed.defs#replyRef',
          },
          createdAt: {
            type: 'string',
            format: 'datetime',
          },
        },
      },
      replyRef: {
        type: 'object',
        required: ['root', 'parent'],
        properties: {
          root: {
            type: 'ref',
            ref: 'lex:space.swsh.feed.defs#entryView',
          },
          parent: {
            type: 'ref',
            ref: 'lex:space.swsh.feed.defs#reply',
          },
          grandparentAuthor: {
            type: 'string',
            format: 'did',
          },
        },
      },
    },
  },
  SpaceSwshFeedEntry: {
    lexicon: 1,
    id: 'space.swsh.feed.entry',
    defs: {
      main: {
        type: 'record',
        description: 'A declaration of a post.',
        key: 'tid',
        record: {
          type: 'object',
          required: ['content'],
          properties: {
            content: {
              type: 'string',
              maxLength: 100000,
              description: 'The primary post content.',
            },
            facets: {
              type: 'array',
              description:
                'Annotations of text (mentions, URLs, hashtags, etc)',
              items: {
                type: 'ref',
                ref: 'lex:space.swsh.richtext.facet',
              },
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
            title: {
              type: 'string',
              maxLength: 1000,
            },
            subtitle: {
              type: 'string',
              maxLength: 1000,
            },
            banner: {
              type: 'blob',
              accept: [
                'image/png',
                'image/jpeg',
                'image/gif',
                'image/webp',
                'image/avif',
                'image/heic',
                'image/heif',
              ],
              maxSize: 1000000,
            },
            blobs: {
              type: 'array',
              items: {
                type: 'blob',
                accept: [
                  'image/png',
                  'image/jpeg',
                  'image/gif',
                  'image/webp',
                  'image/avif',
                  'image/heic',
                  'image/heif',
                ],
                maxSize: 1000000,
              },
            },
            visibility: {
              type: 'string',
              enum: ['public', 'url', 'author'],
              default: 'public',
              description: 'Tells the visibility of the article to AppView.',
            },
          },
        },
      },
    },
  },
  SpaceSwshFeedGetEntries: {
    lexicon: 1,
    id: 'space.swsh.feed.getEntries',
    defs: {
      main: {
        type: 'query',
        description: 'Get a list of the most recent entries.',
        parameters: {
          type: 'params',
          properties: {
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 50,
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['entries'],
            properties: {
              entries: {
                type: 'array',
                items: {
                  type: 'ref',
                  ref: 'lex:space.swsh.feed.defs#entryView',
                },
              },
            },
          },
        },
      },
    },
  },
  SpaceSwshFeedSendEntry: {
    lexicon: 1,
    id: 'space.swsh.feed.sendEntry',
    defs: {
      main: {
        type: 'procedure',
        description: 'Creates or updates an entry.',
        input: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['content'],
            properties: {
              title: {
                type: 'string',
                maxLength: 1000,
              },
              subtitle: {
                type: 'string',
                maxLength: 1000,
              },
              content: {
                type: 'string',
                maxLength: 100000,
              },
              facets: {
                type: 'array',
                items: {
                  type: 'ref',
                  ref: 'lex:space.swsh.richtext.facet',
                },
              },
              visibility: {
                type: 'string',
                enum: ['public', 'url', 'author'],
                default: 'public',
                description: 'Tells the visibility of the article to AppView.',
              },
              rkey: {
                type: 'string',
                description: 'If updating, the rkey of the existing entry.',
              },
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['entry'],
            properties: {
              uri: {
                type: 'string',
                description: 'The URI of the entry.',
              },
              cid: {
                type: 'string',
                description: 'The CID of the entry.',
              },
              entry: {
                type: 'ref',
                ref: 'lex:space.swsh.feed.defs#entryView',
              },
            },
          },
        },
      },
    },
  },
  SpaceSwshRichtextFacet: {
    lexicon: 1,
    id: 'space.swsh.richtext.facet',
    defs: {
      main: {
        type: 'object',
        description: 'Annotation of a sub-string within rich text.',
        required: ['index', 'features'],
        properties: {
          index: {
            type: 'ref',
            ref: 'lex:space.swsh.richtext.facet#byteSlice',
          },
          features: {
            type: 'array',
            items: {
              type: 'union',
              refs: [
                'lex:space.swsh.richtext.facet#mention',
                'lex:space.swsh.richtext.facet#link',
                'lex:space.swsh.richtext.facet#tag',
                'lex:space.swsh.richtext.facet#bold',
                'lex:space.swsh.richtext.facet#italic',
                'lex:space.swsh.richtext.facet#underline',
                'lex:space.swsh.richtext.facet#strikethrough',
                'lex:space.swsh.richtext.facet#code',
              ],
            },
          },
        },
      },
      mention: {
        type: 'object',
        description:
          "Facet feature for mention of another account. The text is usually a handle, including a '@' prefix, but the facet reference is a DID.",
        required: ['did'],
        properties: {
          did: {
            type: 'string',
            format: 'did',
          },
        },
      },
      link: {
        type: 'object',
        description:
          'Facet feature for a URL. The text URL may have been simplified or truncated, but the facet reference should be a complete URL.',
        required: ['uri'],
        properties: {
          uri: {
            type: 'string',
            format: 'uri',
          },
        },
      },
      tag: {
        type: 'object',
        description:
          "Facet feature for a hashtag. The text usually includes a '#' prefix, but the facet reference should not (except in the case of 'double hash tags').",
        required: ['tag'],
        properties: {
          tag: {
            type: 'string',
            maxLength: 640,
            maxGraphemes: 64,
          },
        },
      },
      byteSlice: {
        type: 'object',
        description:
          'Specifies the sub-string range a facet feature applies to. Start index is inclusive, end index is exclusive. Indices are zero-indexed, counting bytes of the UTF-8 encoded text. NOTE: some languages, like Javascript, use UTF-16 or Unicode codepoints for string slice indexing; in these languages, convert to byte arrays before working with facets.',
        required: ['byteStart', 'byteEnd'],
        properties: {
          byteStart: {
            type: 'integer',
            minimum: 0,
          },
          byteEnd: {
            type: 'integer',
            minimum: 0,
          },
        },
      },
      bold: {
        type: 'object',
        description: 'Facet feature for bold text formatting.',
        required: ['byteStart', 'byteEnd'],
        properties: {
          byteStart: {
            type: 'integer',
            minimum: 0,
          },
          byteEnd: {
            type: 'integer',
            minimum: 0,
          },
        },
      },
      italic: {
        type: 'object',
        description: 'Facet feature for italic text formatting.',
        required: ['byteStart', 'byteEnd'],
        properties: {
          byteStart: {
            type: 'integer',
            minimum: 0,
          },
          byteEnd: {
            type: 'integer',
            minimum: 0,
          },
        },
      },
      underline: {
        type: 'object',
        description: 'Facet feature for underlined text formatting.',
        required: ['byteStart', 'byteEnd'],
        properties: {
          byteStart: {
            type: 'integer',
            minimum: 0,
          },
          byteEnd: {
            type: 'integer',
            minimum: 0,
          },
        },
      },
      strikethrough: {
        type: 'object',
        description: 'Facet feature for strikethrough text formatting.',
        required: ['byteStart', 'byteEnd'],
        properties: {
          byteStart: {
            type: 'integer',
            minimum: 0,
          },
          byteEnd: {
            type: 'integer',
            minimum: 0,
          },
        },
      },
      code: {
        type: 'object',
        description: 'Facet feature for monospace/code text formatting.',
        required: ['byteStart', 'byteEnd'],
        properties: {
          byteStart: {
            type: 'integer',
            minimum: 0,
          },
          byteEnd: {
            type: 'integer',
            minimum: 0,
          },
        },
      },
    },
  },
  AppBskyActorDefs: {
    lexicon: 1,
    id: 'app.bsky.actor.defs',
    defs: {
      profileView: {
        type: 'object',
        required: ['did', 'handle'],
        properties: {
          did: {
            type: 'string',
            format: 'did',
          },
          handle: {
            type: 'string',
            format: 'handle',
          },
          displayName: {
            type: 'string',
            maxGraphemes: 64,
            maxLength: 640,
          },
          description: {
            type: 'string',
            maxGraphemes: 256,
            maxLength: 2560,
          },
          avatar: {
            type: 'string',
            format: 'uri',
          },
          indexedAt: {
            type: 'string',
            format: 'datetime',
          },
          createdAt: {
            type: 'string',
            format: 'datetime',
          },
          labels: {
            type: 'array',
            items: {
              type: 'ref',
              ref: 'lex:com.atproto.label.defs#label',
            },
          },
        },
      },
    },
  },
  AppBskyActorProfile: {
    lexicon: 1,
    id: 'app.bsky.actor.profile',
    defs: {
      main: {
        type: 'record',
        description: 'A declaration of a Bluesky account profile.',
        key: 'literal:self',
        record: {
          type: 'object',
          properties: {
            displayName: {
              type: 'string',
              maxGraphemes: 64,
              maxLength: 640,
            },
            description: {
              type: 'string',
              description: 'Free-form profile description text.',
              maxGraphemes: 256,
              maxLength: 2560,
            },
            avatar: {
              type: 'blob',
              description:
                "Small image to be displayed next to posts from account. AKA, 'profile picture'",
              accept: ['image/png', 'image/jpeg'],
              maxSize: 1000000,
            },
            banner: {
              type: 'blob',
              description:
                'Larger horizontal image to display behind profile view.',
              accept: ['image/png', 'image/jpeg'],
              maxSize: 1000000,
            },
            labels: {
              type: 'union',
              description:
                'Self-label values, specific to the Bluesky application, on the overall account.',
              refs: ['lex:com.atproto.label.defs#selfLabels'],
            },
            joinedViaStarterPack: {
              type: 'ref',
              ref: 'lex:com.atproto.repo.strongRef',
            },
            pinnedPost: {
              type: 'ref',
              ref: 'lex:com.atproto.repo.strongRef',
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
          },
        },
      },
    },
  },
} as const satisfies Record<string, LexiconDoc>
export const schemas = Object.values(schemaDict) satisfies LexiconDoc[]
export const lexicons: Lexicons = new Lexicons(schemas)

export function validate<T extends { $type: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType: true,
): ValidationResult<T>
export function validate<T extends { $type?: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: false,
): ValidationResult<T>
export function validate(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: boolean,
): ValidationResult {
  return (requiredType ? is$typed : maybe$typed)(v, id, hash)
    ? lexicons.validate(`${id}#${hash}`, v)
    : {
        success: false,
        error: new ValidationError(
          `Must be an object with "${
            hash === 'main' ? id : `${id}#${hash}`
          }" $type property`,
        ),
      }
}

export const ids = {
  XyzStatusphereDefs: 'xyz.statusphere.defs',
  XyzStatusphereGetStatuses: 'xyz.statusphere.getStatuses',
  XyzStatusphereGetUser: 'xyz.statusphere.getUser',
  XyzStatusphereSendStatus: 'xyz.statusphere.sendStatus',
  XyzStatusphereStatus: 'xyz.statusphere.status',
  ComAtprotoLabelDefs: 'com.atproto.label.defs',
  ComAtprotoRepoApplyWrites: 'com.atproto.repo.applyWrites',
  ComAtprotoRepoCreateRecord: 'com.atproto.repo.createRecord',
  ComAtprotoRepoDefs: 'com.atproto.repo.defs',
  ComAtprotoRepoDeleteRecord: 'com.atproto.repo.deleteRecord',
  ComAtprotoRepoDescribeRepo: 'com.atproto.repo.describeRepo',
  ComAtprotoRepoGetRecord: 'com.atproto.repo.getRecord',
  ComAtprotoRepoImportRepo: 'com.atproto.repo.importRepo',
  ComAtprotoRepoListMissingBlobs: 'com.atproto.repo.listMissingBlobs',
  ComAtprotoRepoListRecords: 'com.atproto.repo.listRecords',
  ComAtprotoRepoPutRecord: 'com.atproto.repo.putRecord',
  ComAtprotoRepoStrongRef: 'com.atproto.repo.strongRef',
  ComAtprotoRepoUploadBlob: 'com.atproto.repo.uploadBlob',
  ComWhtwndBlogDefs: 'com.whtwnd.blog.defs',
  ComWhtwndBlogEntry: 'com.whtwnd.blog.entry',
  ComWhtwndBlogGetAuthorPosts: 'com.whtwnd.blog.getAuthorPosts',
  ComWhtwndBlogGetEntryMetadataByName: 'com.whtwnd.blog.getEntryMetadataByName',
  ComWhtwndBlogGetMentionsByEntry: 'com.whtwnd.blog.getMentionsByEntry',
  ComWhtwndBlogNotifyOfNewEntry: 'com.whtwnd.blog.notifyOfNewEntry',
  SpaceSwshFeedDefs: 'space.swsh.feed.defs',
  SpaceSwshFeedEntry: 'space.swsh.feed.entry',
  SpaceSwshFeedGetEntries: 'space.swsh.feed.getEntries',
  SpaceSwshFeedSendEntry: 'space.swsh.feed.sendEntry',
  SpaceSwshRichtextFacet: 'space.swsh.richtext.facet',
  AppBskyActorDefs: 'app.bsky.actor.defs',
  AppBskyActorProfile: 'app.bsky.actor.profile',
} as const
