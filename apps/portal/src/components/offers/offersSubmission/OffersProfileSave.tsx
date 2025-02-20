import { useRouter } from 'next/router';
// Import { useState } from 'react';
// import { setTimeout } from 'timers';
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid';
import { EyeIcon } from '@heroicons/react/24/outline';
import { Button, TextInput, useToast } from '@tih/ui';

import {
  copyProfileLink,
  getProfileLink,
  getProfilePath,
} from '~/utils/offers/link';

type OfferProfileSaveProps = Readonly<{
  profileId: string;
  token?: string;
}>;

export default function OffersProfileSave({
  profileId,
  token,
}: OfferProfileSaveProps) {
  const { showToast } = useToast();
  // Const [isSaving, setSaving] = useState(false);
  // const [isSaved, setSaved] = useState(false);
  const router = useRouter();

  // Const saveProfile = () => {
  //   setSaving(true);
  //   setTimeout(() => {
  //     setSaving(false);
  //     setSaved(true);
  //   }, 5);
  // };

  return (
    <div className="flex w-full justify-center">
      <div className="max-w-2xl text-center">
        <h5 className="mb-6 text-4xl font-bold text-gray-900">
          Save for future edits
        </h5>
        <p className="mb-2 text-gray-900">We value your privacy.</p>
        <p className="mb-5 text-gray-900">
          To keep you offer profile strictly anonymous, only people who have the
          link below can edit it.
        </p>
        <div className="mb-20 grid grid-cols-12 gap-4">
          <div className="col-span-11">
            <TextInput
              disabled={true}
              isLabelHidden={true}
              label="Edit link"
              value={getProfileLink(profileId, token)}
            />
          </div>
          <Button
            icon={DocumentDuplicateIcon}
            isLabelHidden={true}
            label="Copy"
            variant="primary"
            onClick={() => {
              copyProfileLink(profileId, token);
              showToast({
                title: `Profile edit link copied to clipboard!`,
                variant: 'success',
              });
            }}
          />
        </div>
        {/* <p className="mb-5 text-gray-900">
          If you do not want to keep the edit link, you can opt to save this
          profile under your user account. It will still only be editable by
          you.
        </p>
        <div className="mb-20">
          <Button
            disabled={isSaved}
            icon={isSaved ? CheckIcon : BookmarkSquareIcon}
            isLoading={isSaving}
            label={isSaved ? 'Saved to user profile' : 'Save to user profile'}
            variant="primary"
            onClick={saveProfile}
          />
        </div> */}
        <div>
          <Button
            icon={EyeIcon}
            label="View your profile"
            variant="special"
            onClick={() => router.push(getProfilePath(profileId, token))}
          />
        </div>
      </div>
    </div>
  );
}
